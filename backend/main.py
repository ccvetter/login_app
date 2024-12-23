import uvicorn
import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.getcwd())
from database import init_database as init_db
from v1.users.users import router as users_router
from v1.login.login import router as login_router

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:80",
]
        
app = FastAPI(lifespan=init_db())
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(users_router)
app.include_router(login_router)
