import Link from 'next/link'
import { RegisterForm } from './form'

export default function RegisterPage() {
    return (
        <div className='h-screen w-screen flex justify-center items-center bg-slate-100'>
            <div className='sm:shadow-x1 px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12'>
                <h1 className='font-semibold text-2x1'>Create your Account</h1>
                <RegisterForm />
                <p className='text-center'>
                    Have an account?{' '}
                    <Link className='text-indigo-500 hover:underline' href="/login">
                        Login
                    </Link>{' '}
                </p>
            </div>
        </div>
    )
}
