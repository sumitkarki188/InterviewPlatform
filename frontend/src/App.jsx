import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton ,SignOutButton} from '@clerk/clerk-react';

function App() {


  return (
    <>
      <h1>welcome to the Interview Platform </h1>
      <SignedOut>
        <SignInButton mode='modal' />
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton/>

    </>
  )
}

export default App
