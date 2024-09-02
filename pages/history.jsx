import React from "react";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { Card } from "react-bootstrap";
import { useRouter } from "next/router";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from "react-bootstrap/Button";
import styles from '@/styles/History.module.css'
import { removeFromHistory } from "@/lib/userData";


export default function History(){
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const router = useRouter();

    if(!searchHistory){
        return null;
    }

    let parsedHistory = [];

    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    function historyClicked(e,index){
        let newHistory = searchHistory[index].replaceAll(":","=")
        router.push(`/artwork?${newHistory}`);
    }

    async function removeHistoryClicked(e,index){
        e.stopPropagation(); 
        setSearchHistory(await removeFromHistory(searchHistory[index]))         
    }

    return(<>
        {parsedHistory.length === 0
        &&(
            <Card style={{width: '70rem'}}>
                <Card.Body>
                    <Card.Title><h4>Nothing Here</h4></Card.Title>
                        <Card.Text>
                            Try searching for something else
                        </Card.Text>
                </Card.Body>
            </Card>
        )
        }

        {parsedHistory.length > 0
        &&(
            <ListGroup>
                {parsedHistory.map ( (historyItem,index) => {
                    return(
                    <ListGroup.Item key={index} onClick={e=> historyClicked(e,index)} className={styles.historyListItem}>
                        {Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong> &nbsp;</>))}
                        <Button className="float-end" variant="danger" size="sm" onClick={e => removeHistoryClicked(e,historyItem)}>&times;</Button>
                    </ListGroup.Item>)
                })
                }
            </ListGroup>
        )
        }
    </>)
}