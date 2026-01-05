import React from 'react'
import AppLayout from '../../components/Layout/AppLayout'
import SettingsForm from './SettingsForm'
import EmailVerificationStatus from '@/components/Auth/EmailVerificationStatus'

const SettingsPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Настройки</p>
          <p className="text-white/60 text-base font-normal leading-normal">Управляйте своей учетной записью и предпочтениями.</p>
        </div>

        <EmailVerificationStatus />

        <SettingsForm />
      </div>
    </AppLayout>
  )
}

export default SettingsPage


