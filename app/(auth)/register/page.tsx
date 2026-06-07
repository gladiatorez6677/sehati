import { RegisterForm } from "@/components/auth/register-form"
import { Stethoscope } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          SehatKi
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Daftar untuk memulai perjalanan kesehatan Anda
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}