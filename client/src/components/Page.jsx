import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Button, Alert, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from "dayjs";
import API from '../API'
import '../css/style.css'




function Page(props) {
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    function handleError(err) {
        let errMsg = 'Unkwnown error';
        if (err.errors) {
            if (err.errors[0])
                if (err.errors[0].msg)
                    errMsg = err.errors[0].msg;
        } else if (err.error) {
            errMsg = err.error;
        }
        setErrorMsg(errMsg);
    }

    useEffect(() => {
        if (props.form) {
            setPage(props);
            setLoading(false);
        }
        else {
            API.getPage(id)
                .then((p) => {
                    setPage(p);
                    setLoading(false);
                })
                .catch((err) => { handleError(err); setLoading(false); });
        }
    }, [props]);



    return (
        <>
            {loading ? <Spinner animation="border" style={{ position: 'absolute', top: '50%', left: '50%' }} /> :
                <div style={{ margin: 50 }}>
                    <Button variant='light' onClick={() => navigate('/')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                    </Button>
                    {errorMsg ? <Alert variant='danger' dismissible className='my-2' onClose={() => setErrorMsg('')}>
                        {errorMsg}</Alert> : null}
                    {page == null ? null :
                        <div>
                            <div style={{ marginBottom: 150 }}>
                                <div className='title'>
                                    {page.title ? page.title : "Write a title"}
                                </div>
                                {page.blocks ? page.blocks.sort((a, b) => a.position - b.position).map(e =>
                                    <div key={e.position} className={e.type} style={{ whiteSpace: 'pre-line' }}>
                                        {e.type != 'Image' ? e.content : <Image src={e.content} fluid rounded />}
                                    </div>
                                ) : null
                                }
                            </div>
                            <Row className='footerPage'>
                                <hr />
                                <Col>User: <b>{page.name}</b></Col>
                                <Col>Creation date: <b>{dayjs(page.creationDate).format('DD-MM-YYYY')}</b></Col>
                                <Col>Publication date: <b>{dayjs(page.publicationDate).isValid() ? dayjs(page.publicationDate).format('DD-MM-YYYY') : <Badge bg="warning" text="dark">Draft</Badge>}</b></Col>
                            </Row>
                        </div>}
                </div>
            }
        </>

    );
}

export default Page;