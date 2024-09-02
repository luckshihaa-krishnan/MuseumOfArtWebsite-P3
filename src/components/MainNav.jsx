import React from 'react'
import { Container } from 'react-bootstrap'
import { Nav } from 'react-bootstrap'
import { Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { Button } from 'react-bootstrap'
import { useState } from 'react'
import { useRouter } from 'next/router'
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAtom } from 'jotai'
import { searchHistoryAtom } from '@/store'
import { addToHistory } from '@/lib/userData'
import { removeToken, readToken } from '@/lib/authenticate'


export default function MainNav(){
    const [searchText, setSearchText] = useState('')
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const [isExpanded, setIsExpanded] = useState(false)
    let token = readToken();
    const router = useRouter();

    async function searchButtonPressed(e){
        setIsExpanded(false)
        let queryString = `title:true&q:${searchText}`
        setSearchHistory(await addToHistory(`title=true&q=${queryString}`)) 
        e.preventDefault();
        router.push(`/artwork?title=true&q=${searchText}`)  
    }    

    function logout(){
        setIsExpanded(false);
        removeToken()
        router.push('/login')
    }

    
    return(<>
        <Navbar expand="lg" className="fixed-top navbar-dark bg-dark" expanded={isExpanded}>
        <Container>
            <Navbar.Brand>Luckshihaa Krishnan</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"} expanded={isExpanded}>Home</Nav.Link></Link>
            
            {token && (<>
                <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"} expanded={isExpanded}>Advanced Search</Nav.Link></Link>
            </>)}
            

            </Nav>
            &nbsp;
            {token && ( 
                <form class="d-flex" onSubmit={searchButtonPressed}>
                    <input type="search" value={searchText} onChange={(e)=> setSearchText(e.target.value)} placeholder="Search" aria-label="Search" />
                    &nbsp; <Button type="submit" variant="outline-success">Search</Button>
                </form>
            )}

            &nbsp;
            <Nav>
                {token && ( 
                <NavDropdown title={token.userName} id="basic-nav-dropdown">
                    <Link href="/favourites" passHref legacyBehavior><NavDropdown.Item>Favourites</NavDropdown.Item></Link> 
                    <Link href="/history" passHref legacyBehavior><NavDropdown.Item>Search History</NavDropdown.Item></Link>
                    <Nav.Link onClick={logout}><NavDropdown.Item>Logout</NavDropdown.Item></Nav.Link>
                </NavDropdown>      
                )}
                {!token && (<>
                <Link href="/register" passHref legacyBehavior><Nav.Link active={router.pathname === "/register"} expanded={isExpanded}>Register</Nav.Link></Link>
                <Link href="/login" passHref legacyBehavior><Nav.Link active={router.pathname === "/login"} expanded={isExpanded}>Log In</Nav.Link></Link>
                </>)}
            </Nav>
        </Navbar.Collapse>
        </Container>
        
        </Navbar>
        <br/><br/>
    </>)
}
