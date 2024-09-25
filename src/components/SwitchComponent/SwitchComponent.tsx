import { Switch } from '@mui/material'
import React from 'react'

import './SwitchComponent.css'

type Props = {
    label?: string,
    size?: string,
    checked?: boolean,
    onChange?: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void) | undefined
}

function SwitchComponent({ label, size, checked ,onChange}: Props) {
    return <>

        <div className='switch-container'>
            
            <p className='switch-label'>{label}</p>

            <Switch className='switch-main' defaultChecked={checked}/></div>


    </>
}

export default SwitchComponent