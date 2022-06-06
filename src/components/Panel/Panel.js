import React, {useEffect, useState} from "react";
import * as references from "../../references";
import "./Panel.scss";
import {formatTimestamp} from "../../utils";
import {toast} from "react-hot-toast";

export default function Panel() {
    const [SMSCenter, setSMSCenter] = useState(references.SMSCenter);
    const reloadSMSCenter = () => {
        fetch("/api/sms-center/")
            .then(res => res.json())
            .then(res => {
                setSMSCenter(res);
            });
    }
    useEffect(reloadSMSCenter, []);
    const [SMSList, setSMSList] = useState(references.Phone.sms);
    const [selectedTowerNumber, setSelectedTowerNumber] = useState(0);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(0);
    useEffect(()=>{
        if (!selectedTowerNumber || !selectedPhoneNumber) return;
        fetch(`/api/towers/${selectedTowerNumber}/phones/${selectedPhoneNumber}/sms`)
            .then(res=>res.json())
            .then(res=> {
                setSMSList(res);
                reloadSMSCenter();
            })
            .catch(e=>toast.error(e));
    }, [selectedPhoneNumber]);

    const [popUpContent, setPopUpContent] = useState(null);
    const closePopUp = e => {
        if (e.target.id === "popUpBackground") setPopUpContent(null);
    }

    const addTower = async () => {
        await fetch('/api/towers/', {method: "POST"});
        reloadSMSCenter();
    }
    const addPhone = () => setPopUpContent(<div>
        <form onSubmit={async e => {
            e.preventDefault();
            const phoneNumber = e.target.phone.value;
            await fetch(`/api/towers/${selectedTowerNumber}/phones`,
                {method: "POST", body: JSON.stringify({number: Number(phoneNumber)})});
            reloadSMSCenter();
            setPopUpContent(null);
        }}>
            <input type="number" placeholder="Номер телефона" name="phone" required={true}/>
            <input type="submit" value="Добавить"/>
        </form>
    </div>);
    const sendSMS = () => setPopUpContent(<div>
        <form onSubmit={async e => {
            e.preventDefault();
            const phoneNumber = e.target.phone.value;
            const messageText = e.target.text.value;
            fetch(`/api/sms/`,
                {
                    method: "POST", body: JSON.stringify({
                        from: Number(selectedPhoneNumber),
                        to: Number(phoneNumber),
                        text: messageText + ""
                    })
                }).then(async res=>{
                    if (!res.ok) {
                        throw (await res.text());
                    }
            }).then(()=>{
                reloadSMSCenter();
                setPopUpContent(null);
            }).catch(e=>toast.error(e));
        }}>
            <input type="number" placeholder="Номер телефона" name="phone" required={true}/>
            <input type="text" placeholder="Текст" name="text" required={true}/>
            <input type="submit" value="Отправить"/>
        </form>
    </div>)
    return <>
        <div id="popUpContainer" opened={popUpContent ? "yes" : null}>
            <div id="popUpBackground" onClick={closePopUp}>
                <div id="popUpContent">
                    {popUpContent}
                </div>
            </div>
        </div>
        <div id="panel">
            <div id="smsCenter">
                <p>СМС-центр</p>
            </div>
            <div id="towers">
                {
                    SMSCenter.towers.map(tower =>
                        <div key={tower.number} className="tower"
                             hasunreadmessage={tower.phones.filter(p => !!p.sms.filter(s => !s.read).length).length ? "yes" : null}
                             onClick={() => {
                                 setSelectedTowerNumber(tower.number);
                                 setSelectedPhoneNumber(0);
                             }}>
                            <p>
                                Вышка №{tower.number}
                            </p>
                        </div>
                    )
                }
                <div className="tower add"
                     onClick={addTower}>
                    <p>Добавить</p>
                </div>
            </div>
            <div id="phonesAndSMS">
                <div id="phones">
                    {selectedTowerNumber ? <>
                        {SMSCenter.towers.find(t => t.number === selectedTowerNumber).phones.map(phone =>
                            <div key={phone.number} className="phone"
                                 hasunreadmessage={!!phone.sms.filter(s => !s.read).length ? "yes" : null}
                                 selected={phone.number === selectedPhoneNumber ? "yes" : null}
                                 onClick={() => setSelectedPhoneNumber(phone.number)}>
                                <p>Телефон {phone.number}</p>
                            </div>
                        )}
                        <div className="phone add"
                             onClick={addPhone}>
                            <p>Добавить</p>
                        </div>
                    </> : null}
                </div>
                <div id="sms">
                    {selectedTowerNumber && selectedPhoneNumber ?
                        <>
                            {
                                SMSList.map(sms =>
                                    <div className="sms" key={sms.from+""+sms.timestamp}>
                                        <p>От: {sms.from}</p>
                                        <p>Дата: {formatTimestamp(sms.timestamp)}</p>
                                        <p>Текст: <span>{sms.text}</span></p>
                                    </div>)
                            }
                            <div className="sms add" onClick={sendSMS}>
                                <p>Отправить</p>
                            </div>
                        </> : null
                    }
                </div>
            </div>
        </div>
    </>
}