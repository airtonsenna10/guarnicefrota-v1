import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const Dashboard = () => {
    return (
        <div>
            <h1 className="h3 mb-4 text-gray-800">Dashboard - Visão Geral</h1>
            <Row>
                <Col md={4}>
                    <Card border="primary" style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>Veículos Disponíveis</Card.Title>
                            <Card.Text className="fs-2 fw-bold">15</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card border="warning" style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>Solicitações Pendentes</Card.Title>
                            <Card.Text className="fs-2 fw-bold">5</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card border="danger" style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>Manutenções Agendadas</Card.Title>
                            <Card.Text className="fs-2 fw-bold">2</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;