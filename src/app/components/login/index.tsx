"use client"
import {SubmitHandler, useForm} from "react-hook-form";
import React, {ButtonHTMLAttributes, forwardRef, PropsWithChildren} from "react";
import {useRouter} from "next/navigation";

type Inputs = {
  login: string;
  password: string;
  captcha: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>()

  const {push} = useRouter();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
      <Input label="Login" placeholder=" " {...register("login", {required: true})}   />
      {errors.login && <span className="text-primary mb-2">This field is required</span>}
      <Input label="Password" type="password" placeholder=" " {...register("password", {required: true})}   />
      {errors.password && <span className="text-error mb-2">This field is required</span>}
      <Button className="mt-5">Войти</Button>
      <Button type="button" className="mt-3 bg-primary text-[white]" onClick={() => push('signIn')}>Зарегистрироваться</Button>
    </form>
  )
}


// eslint-disable-next-line react/display-name
const Input = forwardRef(({label, ...props}: any, ref) => (
  <div className="relative h-14 w-full min-w-[200px] mb-1">
    <input
      ref={ref}
      className=" peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-2xl font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
      {...props}
    />
    <label
      className="text-primary  after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-xl font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-xl peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 text-xl">
      {label}
    </label>
  </div>
))

const Button = ({...props}: Partial<ButtonHTMLAttributes<HTMLButtonElement>> & PropsWithChildren) => {
  return (
    <button {...props} className={`rounded-2xl p-3 bg-[white] text-[black] ${props.className}`}/>
  )
}






