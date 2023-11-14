import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Form, Button, ButtonGroup, Offcanvas, Image, Alert, Spinner } from 'react-bootstrap';
import MyNavbar from '../components/MyNavbar';
import Page from '../components/Page';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from "dayjs";
import API from '../API'
import '../css/style.css'




function MyForm(props) {
    const { id } = useParams();
    const [objToEdit, setObjToEdit] = useState(undefined);
    const [title, setTitle] = useState("");
    const [user, setUser] = useState(props.user)
    const [users, setUsers] = useState([]);
    const [publicationDate, setPublicationDate] = useState("");
    const [blocks, setBlocks] = useState([]);
    const [showImageBar, setShowImageBar] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(id ? true : false);

    const navigate = useNavigate();

    useEffect(() => {
        if (props.user.admin) {
            API.getUsers()
                .then((u) => { setUsers(u); })
                .catch((err) => { setErrorMsg(err); });
        }
        if (id) {
            API.getPage(id)
                .then((p) => {
                    setObjToEdit(p);
                    setTitle(p.title);
                    setUser(p);
                    setPublicationDate(dayjs(p.publicationDate).isValid() ? dayjs(p.publicationDate).format('YYYY-MM-DD') : "");
                    setBlocks(p.blocks);
                    setLoading(false);
                })
                .catch((err) => { setErrorMsg(err); setLoading(false); });
        }
    }, []);

    function handleCloseImageBar() {
        setShowImageBar(false)
    };

    function handleShowImageBar() {
        setShowImageBar(true)
    };

    function handleTitle(event) {
        const v = event.target.value;
        setTitle(v);
    }

    function handlePublicationDate(event) {
        const v = event.target.value;
        setPublicationDate(v);
    }

    function handleBlock(event, element) {
        const v = event.target.value;
        const el = { type: element.type, content: v, position: element.position };
        setBlocks((oldList) => oldList.map((e) => {
            if (e.position === element.position) {
                return el;
            } else {
                return e;
            }
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        // Form validation
        if (title === '')
            setErrorMsg('Insert a title');
        else if (blocks.filter((e) => e.type === 'Header').length === 0)
            setErrorMsg('At least one header is required');
        else if (blocks.filter((e) => e.type === 'Paragraph' || e.type === 'Image').length === 0) {
            setErrorMsg('At least one paragraph or image is required');
        }
        else if (blocks.filter((e) => (e.type === 'Header' || e.type === 'Paragraph') && e.content === '').length > 0) {
            setErrorMsg('There are empty paragraphs or headers');
        }
        else {
            const e = {
                title: title,
                publicationDate: dayjs(publicationDate).isValid() ? dayjs(publicationDate).format('YYYY-MM-DD') : null,
                blocks: blocks
            }
            if (objToEdit) {
                e.id = objToEdit.id;
                e.creationDate = dayjs(objToEdit.creationDate).format("YYYY-MM-DD");
                if (props.user.admin) {
                    e.idUser = user.idUser;
                }
                props.editPage(e);
            }
            else {
                e.creationDate = dayjs().format("YYYY-MM-DD");
                if (props.user.admin) {
                    e.idUser = user.idUser ? user.idUser : user.id;
                }
                props.addPage(e);
            }
            navigate("/");
        }
    };

    function deleteBlock(block) {
        setBlocks((oldList) => oldList.filter(
            (e) => e.position !== block.position
        ).map((e) => {
            if (e.position > block.position) {
                return Object.assign({}, e, { type: e.type, content: e.content, position: e.position - 1 });
            } else {
                return e;
            }
        })
        );
    }

    function upBlock(block) {
        setBlocks((oldList) => oldList.map((e) => {
            if (e.position === block.position) {
                return Object.assign({}, e, { type: e.type, content: e.content, position: e.position - 1 });
            } else if (e.position === block.position - 1) {
                return Object.assign({}, e, { type: e.type, content: e.content, position: e.position + 1 });
            } else {
                return e;
            }
        })
        );
        setBlocks((oldlist) => [...oldlist].sort((a, b) => a.position - b.position));
    }

    function downBlock(block) {
        setBlocks((oldList) => oldList.map((e) => {
            if (e.position === block.position) {
                return Object.assign({}, e, { type: e.type, content: e.content, position: e.position + 1 });
            } else if (e.position === block.position + 1) {
                return Object.assign({}, e, { type: e.type, content: e.content, position: e.position - 1 });
            } else {
                return e;
            }
        })
        );
        setBlocks((oldlist) => [...oldlist].sort((a, b) => a.position - b.position));
    }

    function addHeader() {
        const e = { type: 'Header', content: '', position: blocks.length };
        setBlocks((oldList) => [...oldList, e]);
    }

    function addParagraph() {
        const e = { type: 'Paragraph', content: '', position: blocks.length };
        setBlocks((oldList) => [...oldList, e]);
    }

    function addImage(image) {
        const e = { type: 'Image', content: image, position: blocks.length };
        setBlocks((oldList) => [...oldList, e]);
    }

    return (
        <>
            <MyNavbar user={props.user} logout={props.logout} changeFilter={props.changeFilter} title={props.title} updateTitle={props.updateTitle} />
            {loading ? <Spinner animation="border" style={{ position: 'absolute', top: '50%', left: '50%' }} /> :
                <>
                    <Container fluid>
                        <Row>
                            <Col xs={4} className='form'>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group style={{ margin: 15 }}>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Title"
                                            value={title}
                                            onChange={handleTitle}
                                        />
                                    </Form.Group>
                                    {blocks.map((e) =>
                                        <Form.Group style={{ margin: 15 }} key={e.position}>
                                            <div style={{ marginBottom: 15 }}>
                                                <Form.Label as='span' style={{ width: '100%' }}>
                                                    {e.type}
                                                </Form.Label>
                                                <span style={{ float: 'right' }}>
                                                    <Button variant='light' size='sm' onClick={() => upBlock(e)} disabled={e.position === 0 ? true : false}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-circle" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z" />
                                                        </svg>
                                                    </Button>
                                                    {' '}
                                                    <Button variant='light' size='sm' onClick={() => downBlock(e)} disabled={e.position === blocks.length - 1 ? true : false}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z" />
                                                        </svg>
                                                    </Button>
                                                    {' '}
                                                    <Button variant='outline-danger' size='sm' onClick={() => deleteBlock(e)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                                        </svg>
                                                    </Button>
                                                </span>
                                            </div>
                                            {
                                                e.type != 'Image' ?
                                                    <Form.Control as="textarea"
                                                        placeholder={e.type}
                                                        value={e.content}
                                                        onChange={() => handleBlock(event, e)}
                                                    />
                                                    : <Image style={{ width: 200 }} src={e.content} rounded fluid />
                                            }
                                        </Form.Group>)}
                                    <div className="d-grid gap-2">
                                        <ButtonGroup>
                                            <Button variant="outline-dark" onClick={addHeader}>Add header</Button>
                                            <Button variant="outline-dark" onClick={addParagraph}>Add paragraph</Button>
                                            <Button variant="outline-dark" onClick={handleShowImageBar}>Add image</Button>
                                        </ButtonGroup>
                                    </div>
                                    <div style={{ marginTop: 50 }}>
                                        {props.user.admin && users.length != 0 ?
                                            <Form.Group style={{ margin: 15 }}>
                                                <Form.Label>User</Form.Label>
                                                <Form.Select defaultValue={users.find(user => user.idUser === (objToEdit ? objToEdit.idUser : props.user.id)).idUser} onChange={ev => setUser(users.find(user => user.idUser === parseInt(ev.target.value)))}>
                                                    {users.map(e => <option key={e.idUser} value={e.idUser}>{e.name} - {e.mail}</option>)}
                                                </Form.Select>
                                            </Form.Group> : null}
                                        <Form.Group style={{ margin: 15 }}>
                                            <Form.Label>Pubblication date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={publicationDate}
                                                onChange={handlePublicationDate}
                                            />
                                        </Form.Group>

                                        {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}

                                        <div className="d-grid gap-2">
                                            <Button variant='dark' size='md' type="submit">{objToEdit ? 'Edit page' : 'Create page'}</Button>
                                        </div>

                                    </div>
                                </Form >
                            </Col>
                            <Col xs={8}>
                                <Page title={title} blocks={blocks} form={true} name={user.name} publicationDate={publicationDate} creationDate={objToEdit ? dayjs(objToEdit.creationDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD")} />
                            </Col>
                        </Row>
                    </Container>
                    <Offcanvas show={showImageBar} onHide={handleCloseImageBar}>
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Select an image</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Container>
                                <Row>

                                    {[...Array(6)].map((x, i) =>
                                        <Col xs={6} key={i + 1} >
                                            <Button variant='light' onClick={() => { handleCloseImageBar(); addImage(`http://localhost:3001/image${i + 1}.jpg`) }}>
                                                <Image src={`http://localhost:3001/image${i + 1}.jpg`} rounded fluid />
                                            </Button>
                                        </Col>
                                    )}
                                </Row>
                            </Container>
                        </Offcanvas.Body>
                    </Offcanvas>
                </>
            }
        </>
    )
}

export default MyForm
