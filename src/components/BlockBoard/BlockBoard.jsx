import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useHttp } from '../../hooks/useHttp.js'; // Import the custom hook
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../Dialog/Dialog.tsx';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../Select/Select.tsx';
import { Button } from '../Button/Button.tsx';
import { Label } from '../Label/Label.tsx';
import { Input } from '../Input/Input.tsx';
import { Flame, Plus, Trash, ChevronUp, Variable } from 'lucide-react';

const API_URL = 'http://localhost:5000/data';

let globalStorageUuid = sessionStorage.getItem("GLOBAL_STORAGE_UUID")


const BASE_URL = 'http://localhost:5000/data';

export async function createPost(cards, httpRequestHandler) {
    const payload = {
        Actions: {
            MovementSensor: cards
        }
    };

    try {
        globalStorageUuid = sessionStorage.getItem("GLOBAL_STORAGE_UUID") || globalStorageUuid

        if (globalStorageUuid === null) {
            globalStorageUuid = await httpRequestHandler('get', API_URL);
            
            if (globalStorageUuid) {
                globalStorageUuid = globalStorageUuid[0]._id;
                console.log("GLOBAL STORAGE", globalStorageUuid)

                sessionStorage.setItem("GLOBAL_STORAGE_UUID", globalStorageUuid);
            console.log("NEW GLOBAL STORAGE UUID", globalStorageUuid);

                const result = await httpRequestHandler('put', `${API_URL}/${globalStorageUuid}`, payload);
                console.log('Put created:', result);
            }

            
            
        } else {
            const result = await httpRequestHandler('put', `${API_URL}/${globalStorageUuid}`, payload);
            console.log('Post updated:', result);
        }
    } catch (error) {
        console.error('Error creating or updating post:', error);

        const result = await httpRequestHandler('post', API_URL, payload);
        console.log('Post created on retry:', result);

        globalStorageUuid = await httpRequestHandler('get', API_URL);
        globalStorageUuid = globalStorageUuid[0]._id;
        sessionStorage.setItem("GLOBAL_STORAGE_UUID", globalStorageUuid);
    }
}

export async function LoadData(httpRequestHandler) {
    let globalStorageUuid = sessionStorage.getItem("GLOBAL_STORAGE_UUID");

    if (globalStorageUuid) {
        try {
            const result = await httpRequestHandler('get', `${BASE_URL}/${globalStorageUuid}`);
            console.log('Data retrieved successfully:', result);
            return result;
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    } else {

        globalStorageUuid = await httpRequestHandler('get', API_URL);
            
        if (globalStorageUuid) {
            globalStorageUuid = globalStorageUuid[0]._id;
            console.log("GLOBAL STORAGE", globalStorageUuid)

            sessionStorage.setItem("GLOBAL_STORAGE_UUID", globalStorageUuid);
        console.log("NEW GLOBAL STORAGE UUID", globalStorageUuid);

        LoadData(httpRequestHandler)
        }

        LoadData(httpRequestHandler)
    }
    return [];
}

const Board = ({ handleDragStart }) => {
    const [cards, setCards] = useState([]);
    const { httpRequestHandler } = useHttp();
    const [hasChecked, setHasChecked] = useState(false);
    const cooldownRef = useRef(false); // Track the cooldown state

    useEffect(() => {
        async function fetchData() {
            console.log("Fetching data...");
            const globalData = await LoadData(httpRequestHandler);
            console.log("Fetched data:", globalData);

            if (globalData) {
                console.log("Setting cards:", globalData["Actions"]["MovementSensor"]);
                setCards(globalData["Actions"]["MovementSensor"]);
                
            }
            setHasChecked(true);
        }

        fetchData();
    }, [hasChecked, httpRequestHandler]);

    useEffect(() => {
        const saveData = async () => {
            if (!cooldownRef.current) { // Check if cooldown is over
                createPost(cards, httpRequestHandler);
                cooldownRef.current = true; // Set cooldown state

                // Reset cooldown after a delay (e.g., 5 seconds)
                setTimeout(() => {
                    cooldownRef.current = false;
                }, 2000); // Cooldown period in milliseconds
            } else {
                console.log('Cooldown in effect, skipping update');
            }
        };

        if (cards.length > 0) {
            saveData();
        }
    }, [cards, httpRequestHandler]);

    return <>
        
        <div onDragStart={handleDragStart} className="board flex md:ml-[15rem] h-screen w-full gap-3 p-12">
        
            <Column title="Backlog" column="backlog" headingColor="text-neutral-500" cards={cards} setCards={setCards} httpRequestHandler={httpRequestHandler} />
             
        </div>
        </>;
};



const Column = ({ title, headingColor, column, cards, setCards, httpRequestHandler }) => {
    const [active, setActive] = useState(false);

    const handleDragStart = (e, card) => {
        e.dataTransfer?.setData('cardId', card.id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        highlightIndicator(e);
        setActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setActive(false);
        clearHighlights();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setActive(false);
        clearHighlights();

        const cardId = e.dataTransfer ? e.dataTransfer.getData('cardId') : e.target.card?.id;
        if (!cardId) return;

        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);
        const before = element.dataset.before || '-1';

        if (before !== cardId) {
            let updatedCards = [...cards];
            const cardToTransfer = updatedCards.find((c) => c.id === cardId);
            if (!cardToTransfer) return;

            updatedCards = updatedCards.filter((c) => c.id !== cardId);
            const moveToBack = before === '-1';

            if (moveToBack) {
                updatedCards.push({ ...cardToTransfer, column });
            } else {
                const insertAtIndex = updatedCards.findIndex((el) => el.id === before);
                if (insertAtIndex === undefined) return;
                updatedCards.splice(insertAtIndex, 0, { ...cardToTransfer, column });
            }

            setCards(updatedCards);
        }
    };

    const highlightIndicator = (e) => {
        const indicators = getIndicators();
        clearHighlights(indicators);
        const el = getNearestIndicator(e, indicators);
        el.element.style.opacity = '1';
    };

    const clearHighlights = (els) => {
        const indicators = els || getIndicators();
        indicators.forEach((i) => i.style.opacity = '0');
    };

    const getIndicators = () => Array.from(document.querySelectorAll(`[data-column="${column}"]`));

    const getNearestIndicator = (e, indicators) => {
        const DISTANCE_OFFSET = 50;
        return indicators.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = e.clientY - (box.top + DISTANCE_OFFSET);
            return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
        }, {
            offset: Number.NEGATIVE_INFINITY,
            element: indicators[indicators.length - 1]
        });
    };

    const filteredCards = cards.filter((c) => c.column === column);

    return (
        <div className={`w-full sm:w-56  column rounded-md ${filteredCards.length < 1 ? "border-dashed" : "border-none"} border-2 border-gray-400 p-4`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`font-medium ${headingColor}`}>{title}</h3>
                <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
            </div>
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`overflow-y-scroll sm:overflow-hidden h-full w-full transition-colors ${active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'}`}>
                {filteredCards.map((c) => (
                    <CardBlock key={c.id} {...c} handleDragStart={handleDragStart} cards={cards} setCards={setCards} httpRequestHandler={httpRequestHandler} />
                ))}
                <DropIndicator beforeId="-1" column={column} />
                <AddCard column={column} setCards={setCards} cards={cards} httpRequestHandler={httpRequestHandler} />
            </div>
        </div>
    );
};

const CardBlock = ({ title, id, column, type, operation, value, handleDragStart, cards, setCards, httpRequestHandler }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cardType, setCardType] = useState(type || "conditional");
    const [expressionEval, setExpressionEval] = useState(`X igual a ${value}`);
    const [compareValue, setCompareValue] = useState(value);
    const [compareOperation, setCompareOperation] = useState(operation || "equal");

    useEffect(() => {
        const compareOperationStringTable = {
            "equal": "= (Igual a)",
            "greater": "> (Maior que)",
            "less": "< (Menor que)",
            "greater equal": "≥ (Maior ou igual a)",
            "less equal": "≤ (Menor ou igual a)",
        };

        setExpressionEval(`X ${compareOperationStringTable[compareOperation] || 'igual a'} ${compareValue}`);
    }, [compareValue, compareOperation]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDialogOpen(false);

        const updatedCards = cards.map((card) =>
            card.id === id ? { ...card, title, cardType, compareValue, expressionEval, compareOperation, column } : card
        );

        setCards(updatedCards);
        createPost(httpRequestHandler)
    };

    return (
        <>
        

<motion.div
                        layout
                        layoutId={id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, { title, id, column })}
                        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"

                        onClick={() => setDialogOpen(true)}
                    >

                        <Trash className='float-right' />
                        <p className="flex text-sm text-neutral-100 text-balance break-all text-center">{title}</p>
                    </motion.div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    
                </DialogTrigger>
                <DialogContent className="max-w-[80vw] sm:max-w-[40vw] max-h-[80vh] overflow-y-auto overflow-x-hidden">
                    <DialogHeader>
                        <DialogTitle>Edit Expression</DialogTitle>
                        <DialogDescription>
                            Make changes to the expression here. Click Save when done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Type</Label>
                            <Select onValueChange={setCardType}>
                                <SelectTrigger className='w-[180px]'>
                                    <SelectValue placeholder={cardType} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='conditional'>Conditional</SelectItem>
                                    <SelectItem value="action">Action</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="operation" className="text-right">Operation</Label>
                            <Select onValueChange={(newValue) => setCompareOperation(newValue)}>
                                <SelectTrigger className='w-[180px]'>
                                    <SelectValue placeholder={expressionEval} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='equal'>{`= (Igual a)`}</SelectItem>
                                    <SelectItem value='greater'>{"> (Maior que)"}</SelectItem>
                                    <SelectItem value="less">{"< (Maior que)"}</SelectItem>
                                    <SelectItem value='greater equal'>≥ (Maior ou igual a)</SelectItem>
                                    <SelectItem value='less equal'>≤ (Menor ou igual a)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className='flex ml-20 w-[100px]'>{expressionEval}</p>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right">Value</Label>
                            <Input
                                id='value'
                                value={compareValue}
                                className="w-[180px]"
                                onChange={(e) => setCompareValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DropIndicator beforeId={id} column={column} />
        </>
    );
};

export default Board;


const DropIndicator = ({ beforeId, column }) => {
    return <div data-before={beforeId || '-1'} data-column={column} className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"></div>;
};

const BurnBarrel = ({ cards ,setCards, httpRequestHandler }) => {
    const [active, setActive] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = (e) => {
        setActive(false);
    };

    const handleDrop = (e) => {
        const cardId = e.dataTransfer ? e.dataTransfer.getData('cardId') : e.target.card.id;
        setCards((pv) => pv.filter((c) => c.id !== cardId));
        setActive(false);


        
    };

    return (
        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${active ? 'border-red-800 bg-red-800/20 text-red-500' : 'border-neutral-500 bg-neutral-500/20 text-neutral-500'}`}>
            {active ? <Flame className="animate-bounce" size={64} color="#ef4444" /> : <Trash size={64} />}
        </div>
    );
};


const AddCard = ({ column, setCards, cards, httpRequestHandler }) => {

    const [dialogOpen,setDialogOpen] = useState(false)

    const [adding, setAdding] = useState(false);

    const [CardType, SetCardType] = useState("conditional")

    const [ExpressionEval, SetExpressionEval] = useState("X igual a Y")
    const [compareValue, SetCompareValue] = useState("0")
    const [compareOperation, setOperation] = useState("equal")
    const [compareOperationString, setOperationString] = useState("= (Igual a)")

    let title = ""

    switch(CardType) {
        case "conditional": title = "Condicional"; break;

        case "Action": title = "Ação"; break;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const newCard = {
            title,
            CardType,
            compareValue,
            ExpressionEval,
            compareOperation,
            compareOperationString,
            column,
            id : uuidv4()
        }

        setCards((prevCards) => [...prevCards, newCard]);

        setDialogOpen(false)
    }

    const EditExpression = (operation) => {



        setOperation(operation)
        console.log(compareOperation)


        switch (operation) {

            case 'equal': SetExpressionEval(`X igual a ${compareValue}`); break;
            case 'greater': SetExpressionEval(`X maior que ${compareValue}`); break;
            case 'less': SetExpressionEval(`X menor que ${compareValue}`); break;
            case 'greater equal': SetExpressionEval(`X maior ou igual a ${compareValue}`); break;
            case 'less equal': SetExpressionEval(`X menor ou igual a ${compareValue}`); break;
        }

        switch (operation) {

            case 'equal': setOperationString(`= (Igual a)`); break;
            case 'greater': setOperationString(`> (Maior que)`); break;
            case 'less': setOperationString(`< (Menor que)>`); break;
            case 'greater equal': setOperationString(`>= (Maior que)`); break;
            case 'less equal': setOperationString(`<= (Maior que)>`); break;

        }


    }


    return <>



<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild className='flex items-center justify-center m-auto'>
                <Button variant="outline">
                    <div layout className='mt-1.5 flex items-center justify-center gap-1.5'>
                       
                       
                       
                       
                       
                       
                       
                       
                        <button onClick={() => setAdding(false)} className='px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50 text-center'>
                        <p>{`Global Storage: ${globalStorageUuid}`}</p>

                       
                       
                       
                       
                       
                       
                        </button>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto overflow-x-hidden">
                <DialogHeader>
                    <DialogTitle>Editar Expressão</DialogTitle>
                    <DialogDescription>
                        Faça alterações na expressão aqui. Clique em Salvar quando concluir.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Tipo
                        </Label>
                        <Select onValueChange={(newValue) => SetCardType(newValue)}>
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder="Conditional" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='conditional'>Condicional</SelectItem>
                                <SelectItem value="action">Ação</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="operation" className="text-right">
                            Operação
                        </Label>
                        <Select onValueChange={EditExpression}>
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder="= (Igual a)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='equal'>{`= (Igual a)`}</SelectItem>
                                <SelectItem value='greater'>{`> (Maior que)`}</SelectItem>
                                <SelectItem value="less">{`< (Menor que)`}</SelectItem>
                                <SelectItem value='greater equal'>{`>= (Maior ou igual a)`}</SelectItem>
                                <SelectItem value='less equal'>{`<= (Menor ou igual a)`}</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className='flex ml-20 w-full'>{ExpressionEval}</p>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right">
                            Valor
                        </Label>
                        <Input
                            id='value'
                            defaultValue={compareValue}
                            className="w-[180px]"
                            onKeyUp={(event) => {

                                SetCompareValue(event.target.value);







                            }}
                        />

                    </div>

                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Salvar Alterações</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


    </>

}

const RenderIcon = (icon) => {

    switch (icon) {
        case "Variable": {
            return <Variable />
        }
    }

}



const DEFAULT_CARDS = [
    // BACKLOG

    { title: "Look into render bug in dashboard", id: "1", "column": "backlog", type: "conditional", operation: "equal", value: "0" },

    { title: "SOX compliance checklist", id: "2", column: "backlog" },

]



const CARD_TYPES = {
    conditional: {
        title: "Conditional",
        color: "#FF69B4",
        icon: "Variable"

    }
}

export { Board }