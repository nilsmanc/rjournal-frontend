import React from 'react'
import { setCookie } from 'nookies'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, FormProvider } from 'react-hook-form'

import { RegisterFormShema } from '../../../utils/validations'
import { FormField } from '../../FormField'
import { CreateUserDto } from '../../../utils/api/types'
import { setUserData } from '../../../redux/slices/user'
import { useAppDispatch } from '../../../redux/hooks'
import { Api } from '../../../utils/api'

import { Button } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

interface RegisterFormProps {
  onOpenRegister: () => void
  onOpenLogin: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onOpenRegister, onOpenLogin }) => {
  const dispatch = useAppDispatch()
  const [errorMessage, setErrorMessage] = React.useState('')
  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(RegisterFormShema),
  })
  const onSubmit = async (dto: CreateUserDto) => {
    try {
      const data = await Api().user.register(dto)
      setCookie(null, 'rtoken', data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      setErrorMessage('')
      dispatch(setUserData(data))
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
