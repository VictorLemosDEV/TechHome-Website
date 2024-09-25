import React from "react";
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import '../styles/globals.css'

import { Toaster } from "../components/Toaster/Toaster.tsx"
import { toast } from "sonner";
import { Button } from "../components/Button/Button.tsx";



async function CallBluetooth() {
    navigator.bluetooth.requestDevice({ acceptAllDevices:true})
.then(device => device.gatt.connect())
.then(server => {
  // Getting Battery Service…
  return server.getPrimaryService('battery_service');
})
.then(service => {
  // Getting Battery Level Characteristic…
  return service.getCharacteristic('battery_level');
})
.then(characteristic => {
  // Reading Battery Level…
  return characteristic.readValue();
})
.then(value => {
  console.log(`Battery percentage is ${value.getUint8(0)}`);
})
.catch(error => { console.error(error); });
}
   

export default function Home() {
    


    return <>

        <Navbar elementActive="home"/>

        <Toaster expand={true} toastOptions={{
            unstyled: true,
            classNames: {
                toast: 'toast bg-special-hover rounded-lg',
                description: "description",
                title: 'title font-bold',
                icon: "icon",
                cancelButton: "cancel  hover:bg-primary/90 rounded-lg"


              },
              
              duration: 5000,
              
        }} visibleToasts={1} />

        <main>
            <h1>Homepage</h1>

            

            <Link to={"/produto"}>Produtos</Link>

            <p className="text-2xl font-bold underline">Oi</p>

            <button onClick={CallBluetooth}>Clicka aqui</button>
           


            


        </main>

    </>
}