import { authClient } from '@/app/lib/auth-client'
import { redirect } from 'next/navigation'


const SignOut = () => {
  async function handleLogout() {
        await authClient.signOut({
          fetchOptions: {
            onSuccess:() => {
              redirect('/signin')
            },
          },
        });
      }
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default SignOut
