import { FC, createContext, useContext, useEffect } from "react"
import useCurrentUser from "framework/hooks/use-current-user.hook"
import useArtFlowz from "@framework/hooks/use-art-flowz.hook"

export interface State {}

const initialState = {}

const Context = createContext<State | any>(initialState)

interface Props {
  children: any
}

const UserProvider: FC<Props> = ({ children }) => {
  const [user, address]: any = useCurrentUser()

  const { createCommission, allCommissions, getAllCommissions } = useArtFlowz()

  return (
    <Context.Provider
      value={{
        createCommission,
        allCommissions,
        getAllCommissions,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default UserProvider

export const useUser = () => {
  return useContext(Context)
}
