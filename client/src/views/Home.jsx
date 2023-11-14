import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Container, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MyNavbar from '../components/MyNavbar';
import PageCard from '../components/PageCard';
import LoadingCard from '../components/LoadingCard';
import dayjs from "dayjs";
import '../css/style.css'






function Home(props) {

    return (
        <>
            <MyNavbar user={props.user} logout={props.logout} changeFilter={props.changeFilter} title={props.title} updateTitle={props.updateTitle} />
            {props.errorMsg ? <Alert variant='danger' dismissible className='my-2' onClose={props.resetErrorMsg}>
                {props.errorMsg}</Alert> : null}
            <Container fluid>
                <Row style={{ padding: 20 }}>
                    {props.initialLoading ?
                        <LoadingCard /> :
                        <>
                            {props.user ?
                                //Authenticated
                                <>{props.filter === 'published' ?
                                    //published pages
                                    <>
                                        <div className='Header'>Published pages</div>
                                        {
                                            props.pages.filter((e) => dayjs(e.publicationDate).diff(dayjs(), 'day') <= 0).length != 0 ? props.pages.filter((e) => dayjs(e.publicationDate).diff(dayjs(), 'day') <= 0).sort((a, b) => dayjs(a.publicationDate).diff(dayjs(b.publicationDate))).map((e) =>
                                                <PageCard key={e.id} page={e} user={props.user} deletePage={props.deletePage} />
                                            ) : 'No page to display'
                                        }
                                    </>
                                    :
                                    <>
                                        {
                                            props.filter === 'all-pages' ?
                                                //all pages
                                                <>
                                                    <div className='Header'>All pages</div>
                                                    {
                                                        props.pages.length != 0 ? props.pages.map((e) =>
                                                            <PageCard key={e.id} page={e} user={props.user} deletePage={props.deletePage} />
                                                        ) : 'No page to display'
                                                    }
                                                </>
                                                :
                                                //my-pages
                                                <>
                                                    <div className='Header'>My pages</div>
                                                    {
                                                        props.pages.filter((e) => e.idUser === props.user.id).length != 0 ? props.pages.filter((e) => e.idUser === props.user.id).map((e) =>
                                                            <PageCard key={e.id} page={e} user={props.user} deletePage={props.deletePage} />
                                                        ) : 'No page to display'
                                                    }</>
                                        }</>
                                }</>
                                :
                                //Not authenticated
                                <>
                                    <div className='Header'>Published pages</div>
                                    {
                                        props.pages.length != 0 ? props.pages.sort((a, b) => dayjs(a.publicationDate).diff(dayjs(b.publicationDate))).map((e) =>
                                            <PageCard key={e.id} page={e} user={props.user} />
                                        ) : 'No page to display'
                                    }</>
                            }
                        </>
                    }
                </Row>
            </Container>
            {props.user != undefined ?
                <Link to="/add">
                    <Button variant='dark' size='lg' style={{ borderRadius: 30, position: 'fixed', bottom: 20, right: 20 }}>+</Button>
                </Link> : null}

        </>
    )
}

export default Home
