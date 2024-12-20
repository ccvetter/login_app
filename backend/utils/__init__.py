import os
import bcrypt
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from logging import getLogger
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Union, Any
from dotenv import load_dotenv

# Logger setup
logger = getLogger(__name__)

load_dotenv()

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")
JWT_REFRESH_SECRET_KEY = os.environ.get("JWT_REFRESH_SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES")

def hash_password(password: str):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bytes(salt))
    return hashed_password.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_expires_delta(expires_delta: int = None) -> str:
    """
    Calculate the expiration time for a token.

    Args:
        expires_delta (int): Optional number of minutes to set the expiration time.
    
    Returns:
        str: The expiration time as an ISO 8601 formatted string.
    """
    if expires_delta is not None:
        expires_delta = int((datetime.now(timezone.utc) + timedelta(minutes=int(expires_delta))).timestamp())
    else:
        expires_delta = int((datetime.now(timezone.utc) + timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))).timestamp())

    return expires_delta

def create_access_token(subject: Union[str, Any], expires: int = None) -> str:
    expires_delta = get_expires_delta(expires)
    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, ALGORITHM)
    
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any], expires: int = None) -> str:
    expires_delta = get_expires_delta(expires)
    print(expires_delta)
    to_encode = {"exp": int(expires_delta), "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_REFRESH_SECRET_KEY, ALGORITHM)
    
    return encoded_jwt

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)
        self.secret_key = JWT_SECRET_KEY

    async def __call__(self, request: Request) -> dict:
        """
        Override the __call__ method to validate and decode the JWT.
        """
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if credentials:
            token = credentials.credentials
            return self.decode_jwt(token)
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization header")

    def decode_jwt(self, token: str) -> dict:
        """
        Decode the JWT token and validate its payload.
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[ALGORITHM])
            logger.info(f"Token decoded successfully: {payload}")
            return payload
        except ExpiredSignatureError:
            logger.error("Token has expired")
            raise HTTPException(status_code=401, detail="Token expired")
        except InvalidTokenError as e:
            logger.error(f"Invalid token: {str(e)}")
            raise HTTPException(status_code=403, detail="Invalid token")
   