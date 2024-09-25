import React, { SyntheticEvent } from "react";
import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import ActionModal from "../components/ActionModal/ActionModal.tsx";

import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';


import { Toaster } from "../components/Toaster/Toaster.tsx"
import { toast } from "sonner";
import { Button } from "../components/Button/Button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/Card/Card.tsx"
import { Input } from "../components/Input/Input.tsx"
import { Label } from "../components/Label/Label.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select/Select.tsx"

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { BellRing, Check, Power } from "lucide-react"
import { Switch } from "../components/Switch/Switch.tsx"

import { cn } from "../components/cn.tsx";
import { type } from "@testing-library/user-event/dist/type/index";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
]

function ToggleSwitch(event: SyntheticEvent) {

  let element = event.currentTarget


  let state = element.getAttribute("data-state");

  console.log(state == "checked")

  if (state == "unchecked") {

    element.setAttribute("data-state", "checked")

    element.setAttribute("aria-checked", "true")

    element.getElementsByTagName("span")[0].setAttribute("data-state", "checked")

    toast.message("Sensor foi ligado!", {
      cancel: {
        label: "Desligar",
        onClick: () => {
          toast.dismiss()

          element.setAttribute("data-state", "unchecked")

          element.setAttribute("aria-checked", "false")

          element.getElementsByTagName("span")[0].setAttribute("data-state", "unchecked")
        }
      }
    })

  } else {

    element.setAttribute("data-state", "unchecked")

    element.setAttribute("aria-checked", "false")

    element.getElementsByTagName("span")[0].setAttribute("data-state", "unchecked")

    toast.message("Sensor foi desligado!", {
      cancel: {
        label: "Ligar",
        onClick: () => {
          toast.dismiss()
          element.setAttribute("data-state", "checked")

          element.setAttribute("aria-checked", "true")

          element.getElementsByTagName("span")[0].setAttribute("data-state", "checked")
        }
      }
    })


  }

}


async function ExpandModal(event: SyntheticEvent) {

  let Modal: HTMLElement | null = event.currentTarget.parentElement

  Modal?.classList.remove("hide")




  Modal?.classList.add("active")




}

async function HideShowModal(event: SyntheticEvent) {

  let Modal: HTMLElement | null = event.currentTarget.closest(".Card-Container");

  console.log(event.currentTarget)


  if (Modal?.classList.contains("hide")) {
    // Show Modal

    event.currentTarget.classList.add("open")


    Modal?.classList.remove("hide")



  } else {
    // Hide Modal

    event.currentTarget.classList.remove("open")


    Modal?.classList.add("hide")


  }




}


export default function Sensors() {
  return <>

    <Navbar elementActive="sensors" />

    <main>

      <Toaster  closeButton={true} expand={true} toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'toast bg-special-hover rounded-lg',
          description: "description",
          title: 'title font-bold',
          icon: "icon",
          cancelButton: "cancel  hover:bg-primary/90 rounded-lg"


        },

        duration: 2000,

      }} visibleToasts={1} />


      <Card className="Card-Container relative  m-auto rounded-lg margin- hover:border-white transition-all  ease-in duration-150" >
        <CardHeader className="card-header">
          <Button variant="ghost" size="icon" className=" dropdown-button" onClick={HideShowModal}>
            <ArrowBackIosNewIcon className="h-4 w-4  transition-all ease-in duration-200" />
          </Button>

          <CardTitle className="title text-3xl flex relative justify-center  font-bold text-center">Sensor de Movimento</CardTitle>
          <CardDescription className="description flex justify-center content-center text-center">Detecta movimentações no ambiente.</CardDescription>
        </CardHeader>
        <IconButton className='add-action-button bg-special' onClick={ExpandModal} >

          <AddIcon className='icon' />

        </IconButton>
        <CardContent className=" card-content dark grid gap-4">
          <div className="relative flex items-center space-x-4 rounded-md border border-ring p-4 mb-6">
            <Power />
            <div className="flex-1 space-y-1 max-w-96">
              <p className="text-sm font-medium leading-none">
                Ligar/Desligar Sensor
              </p>
              <p className="text-sm text-muted-foreground text-clip overflow-hidden">
                Liga ou desliga o sensor.
              </p>
            </div>
            <Switch className="absolute flex right-8" onClick={ToggleSwitch} />
          </div>

          <p>Valor Atual: Sem Movimento</p>

        </CardContent>
        <CardFooter className="card-footer">

        </CardFooter>
      </Card>

      <Card className="Card-Container relative  m-auto rounded-lg margin- hover:border-white transition-all  ease-in duration-150" >
        <CardHeader className="card-header">
          <Button variant="ghost" size="icon" className="dropdown-button" onClick={HideShowModal}>
            <ArrowBackIosNewIcon className="h-4 w-4  transition-all ease-in duration-200" />
          </Button>

          <CardTitle className="title text-3xl flex relative justify-center  font-bold text-center">Sensor de Temperatura e Humidade</CardTitle>
          <CardDescription className="description flex justify-center content-center text-center">Mede a Temperatura e Humidade do ambiente.</CardDescription>
        </CardHeader>
        <IconButton className='add-action-button bg-special' onClick={ExpandModal} >

          <AddIcon className='icon' />

        </IconButton>
        <CardContent className=" card-content dark grid gap-4">
          <div className="relative flex items-center space-x-4 rounded-md border border-ring p-4 mb-6">
            <Power />
            <div className="flex-1 space-y-1 max-w-96">
              <p className="text-sm font-medium leading-none">
                Ligar/Desligar Sensor
              </p>
              <p className="text-sm text-muted-foreground text-clip overflow-hidden">
                Liga ou desliga o sensor.
              </p>
            </div>
            <Switch className="absolute flex right-8"  onClick={ToggleSwitch}/>
          </div>

          <p>Valor Atual: 0% 0ºC</p>

        </CardContent>
        <CardFooter className="card-footer">

        </CardFooter>
      </Card>

      <Card className="Card-Container relative  m-auto rounded-lg margin- hover:border-white transition-all  ease-in duration-150" >
        <CardHeader className="card-header">
          <Button variant="ghost" size="icon" className="dropdown-button" onClick={HideShowModal}>
            <ArrowBackIosNewIcon className="h-4 w-4  transition-all ease-in duration-200" />
          </Button>

          <CardTitle className="title text-3xl flex relative justify-center  font-bold text-center">Sensor de Nivel Da Água</CardTitle>
          <CardDescription className="description flex justify-center content-center text-center">Mede o Nível da Água.</CardDescription>
        </CardHeader>
        <IconButton className='add-action-button bg-special' onClick={ExpandModal} >

          <AddIcon className='icon' />

        </IconButton>
        <CardContent className=" card-content dark grid gap-4">
          <div className="relative flex items-center space-x-4 rounded-md border border-ring p-4 mb-6">
            <Power />
            <div className="flex-1 space-y-1 max-w-96">
              <p className="text-sm font-medium leading-none">
                Ligar/Desligar Sensor
              </p>
              <p className="text-sm text-muted-foreground text-clip overflow-hidden">
                Liga ou desliga o sensor.
              </p>
            </div>
            <Switch className="absolute flex right-8" onClick={ToggleSwitch} />
          </div>

          <p>Valor Atual: 0</p>

        </CardContent>
        <CardFooter className="card-footer">

        </CardFooter>
      </Card>

      <Card className="Card-Container relative  m-auto rounded-lg margin- hover:border-white transition-all  ease-in duration-150" >
        <CardHeader className="card-header">
          <Button variant="ghost" size="icon" className="dropdown-button" onClick={HideShowModal}>
            <ArrowBackIosNewIcon className="h-4 w-4  transition-all ease-in duration-200" />
          </Button>

          <CardTitle className="title text-3xl flex relative justify-center  font-bold text-center">Foto-Resistor</CardTitle>
          <CardDescription className="description flex justify-center content-center text-center">Mede a intensidade da luz ambiente.</CardDescription>
        </CardHeader>
        <IconButton className='add-action-button bg-special' onClick={ExpandModal} >

          <AddIcon className='icon' />

        </IconButton>
        <CardContent className=" card-content dark grid gap-4">
          <div className="relative flex items-center space-x-4 rounded-md border border-ring p-4 mb-6">
            <Power />
            <div className="flex-1 space-y-1 max-w-96">
              <p className="text-sm font-medium leading-none">
                Ligar/Desligar Sensor
              </p>
              <p className="text-sm text-muted-foreground text-clip overflow-hidden">
                Liga ou desliga o sensor.
              </p>
            </div>
            <Switch className="absolute flex right-8" onClick={ToggleSwitch} />
          </div>

          <p>Valor Atual: 0</p>

        </CardContent>
        <CardFooter className="card-footer">

        </CardFooter>
      </Card>

      <Card className="Card-Container relative  m-auto rounded-lg margin- hover:border-white transition-all  ease-in duration-150" >
        <CardHeader className="card-header">
          <Button variant="ghost" size="icon" className="dropdown-button" onClick={HideShowModal}>
            <ArrowBackIosNewIcon className="h-4 w-4  transition-all ease-in duration-200" />
          </Button>

          <CardTitle className="title text-3xl flex relative justify-center  font-bold text-center">Sensor de Humidade do Solo</CardTitle>
          <CardDescription className="description flex justify-center content-center text-center">Mede a Humidade da terra.</CardDescription>
        </CardHeader>
        <IconButton className='add-action-button bg-special' onClick={ExpandModal} >

          <AddIcon className='icon' />

        </IconButton>
        <CardContent className=" card-content dark grid gap-4">
          <div className="relative flex items-center space-x-4 rounded-md border border-ring p-4 mb-6">
            <Power />
            <div className="flex-1 space-y-1 max-w-96">
              <p className="text-sm font-medium leading-none">
                Ligar/Desligar Sensor
              </p>
              <p className="text-sm text-muted-foreground text-clip overflow-hidden">
                Liga ou desliga o sensor.
              </p>
            </div>
            <Switch className="absolute flex right-8" onClick={ToggleSwitch} />
          </div>

          <p>Valor Atual: 0%</p>

        </CardContent>
        <CardFooter className="card-footer">

        </CardFooter>
      </Card>





      <div className="ocupando-espaco" style={{ height: "10rem" }}></div>

    </main>

  </>
}