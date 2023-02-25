import { FC, createContext, useContext } from "react"
import useCurrentUser from "framework/hooks/use-current-user.hook"

export interface State {}

const initialState = {}

const Context = createContext<State | any>(initialState)

interface Props {
    children: any;
  }

const AuthProvder: FC<Props> = ({ children }) => {
  const [user, loggedIn, logIn, logOut]: any = useCurrentUser()
  return (
    <Context.Provider
      value={{
        user,
        loggedIn,
        logIn,
        logOut,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default AuthProvder

export const useAuth = () => {
  const value = useContext(Context)
  return value
}
