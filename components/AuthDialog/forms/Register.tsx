import React from 'react'
import { setCookie } from 'nookies'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'
import { RegisterFormShema } from '../../../utils/validations'
import { FormField } from '../../FormField'
import { UserApi } from '../../../utils/api'
import { CreateUserDto } from '../../../utils/api/types'
import { Alert } from '@material-ui/lab'

interface RegisterFormProps {
  onOpenRegister: () => void
  onOpenLogin: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onOpenRegister, onOpenLogin }) => {
  const [errorMessage, setErrorMessage] = React.useState('')
  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(RegisterFormShema),
  })
  const onSubmit = async (dto: CreateUserDto) => {
    try {
      const data = await UserApi.register(dto)
      console.log(data)
      setCookie(null, 'authToken', data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      setErrorMessage('')
    } catch (err) {
      console.warn('Register error', err)
      if (err.response) {
        setErrorMessage(err.response.data.message)
      }
    }
  }
  return (
    <div>
      <FormProvider {...form}>
        <FormField name='fullName' label='Имя и фамилия' />
        <FormField name='email' label='Почта' />
        <FormField name='password' label='Пароль' />
        {errorMessage && (
          <Alert severity='error' className='mb-20'>
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='d-flex align-center justify-between'>
            <Button
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              onClick={onOpenRegister}
              type='submit'
              color='primary'
              variant='contained'>
              Зарегистрироваться
            </Button>
            <Button onClick={onOpenLogin} color='primary' variant='text'>
              Войти
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
