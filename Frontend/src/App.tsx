
import { useState } from 'react'
import './App.css'

const APP_STATUS = {
  IDLE: 'idle',
  ERROR: 'error',
  READY_UPLOAD: 'ready_upload',
  UPLOADING: 'uploading',
  READY_USAGE: 'ready_usage',
} as const

const BUTTON_TEXT = {
    [APP_STATUS.READY_UPLOAD]: 'Subir archivo',
    [APP_STATUS.UPLOADING]: 'Subiendo archivo...'
  } 


type AppStatusType = typeof APP_STATUS[keyof typeof APP_STATUS];

function App() {

  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
    const [file] = event.target.files ?? []

    if (file) {
      setFile(file)
      setAppStatus(APP_STATUS.READY_UPLOAD)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLInputElement> ) => {
    event.preventDefault();
    if(appStatus !== APP_STATUS.READY_UPLOAD || !file ){
      return
    }
    setAppStatus(APP_STATUS.UPLOADING)
  }
  
 
  const showButton = appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING
  

  return (
    <>
      <h4>Challengue: Upload csv + Search </h4>
      <form onSubmit={handleSubmit} >
        
        <label htmlFor="">
        <input type="file" accept='.csv' name='file' onChange={handleInputChange}  />
        </label>

        {showButton && (<button disabled={appStatus == APP_STATUS.UPLOADING } >{BUTTON_TEXT[appStatus]}</button>)}
      </form>
    </>
  )
}

export default App
