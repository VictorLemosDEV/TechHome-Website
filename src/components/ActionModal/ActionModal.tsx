import React, { ReactNode, SyntheticEvent, useEffect, useState } from 'react'

import "./ActionModal.css"

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button, Tooltip , Divider, IconButton} from '@mui/material';




import SwitchComponent from '../SwitchComponent/SwitchComponent.tsx';

type SwitchModal = {
    label: string,
    checked: boolean,
}

type Props = {
    title: string,

    Options?: Array<SwitchModal>,
}

async function ExpandModal(event: SyntheticEvent) {

    let Modal: HTMLElement | null = event.currentTarget.parentElement

    Modal?.classList.remove("hide")

    let button = event.currentTarget

    event.currentTarget.classList.add("transition")

    setTimeout(() => {

        button.classList.add("hidden")

        Modal?.classList.add("active")
    }, 200)


}



async function HideShowModal(event: SyntheticEvent) {

    let Modal: HTMLElement | null = event.currentTarget.parentElement



    if (Modal?.classList.contains("hide")) {
        // Show Modal

        setTimeout(() => {

            Modal?.classList.remove("hide")
    
        }, 200)


    } else {
        // Hide Modal

        setTimeout(() => {

            Modal?.classList.add("hide")
    
        }, 200)

    }




}

export default function ActionModal({ title = "Sensor", Options = []}: Props) {

    const OptionsElement = () => (
        <div className='options'>


            {Options.map((option, index) => (

                <SwitchComponent label={option.label} checked={option.checked} onChange={console.log("Teste")} />

            ))
            }

        </div>
    )

    return <>

        <div className='action-modal'  >

        
            <IconButton className='dropdown-button' onClick={HideShowModal}>

                <ArrowBackIosNewIcon className='icon dropdown'/>

            </IconButton>
        

            <div className='title-section'>
            
                

                <h1 className='modal-title font-bold'>{title}</h1>

            </div>


            <Tooltip title="Adicionar Sensor">

                <IconButton className='add-action-button' onClick={ExpandModal} disableEl>

                    <AddIcon className='icon' />

                </IconButton>

            </Tooltip>

            <div className='content'>

                <OptionsElement />

                <p className='text'>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</p>

            </div>


            

        </div>


    </>
}