import React, { useState, useEffect } from "react";
import './BuildingsPage.css';
import API from '../../../services/Infos/Infos'
import 'react-widgets/styles.css';
import Table from '../../../components/bootstrapTable2';
import colunas from './Utils/colunas';
import Input from "react-widgets/cjs/Input";
import imgteste from './img/img4.jpg';

function SculpPage() {
    //loading1 para carregar tabela, 2 para carregar dados da construção
    const [loading, setLoading] = useState(0);
    const [comboSculp, setComboSculp] = useState(false);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [slides, setSlides] = useState(false);
    const [dataBuildings, setDataBuildings] = useState([]);
    const [changeModal, setChangeModal] = useState(false);
    const [imagesModal, setImagesModal] = useState(false);
    useEffect(() => {

        callApis()



    }, []);
    const callApis = async (id_author, name) => {

        setLoading(1)
        const res = await API.getBuildTable().then(e => {
            setDataBuildings(e)

        })

        setLoading(0)


    }

    const changeContent = async (e) => {
        console.log(e)
        setChangeModal(e)



    }



    const openModal = async (id_build) => {
        setLoading(2)
        await setDescription('');
        await setTitle('');
        await setImagesModal([])
        console.log(id_build)
        let paints = await API.getBuildContent({ id_build: id_build }).then(e => {
            setDescription(e.descriptions[0].DESCRIPTION);
            setTitle(e.descriptions[0].TITLE)
            let concatImages = []
            let contadorImages = 0
            for(let el of e.images){
                console.log(el)
                concatImages = [
                    ...concatImages[contadorImages]? concatImages[contadorImages] : concatImages, <img class='' style={{borderRadius: "20px"}}src={`/images/buildings/${el.PATH_NAME }`} alt='' />
                ]
                contadorImages ++
            }
            setImagesModal(concatImages)
            console.log(concatImages)
            
        }).catch(console.error)

        setLoading(0)

        }

    
    const headerStyle = { borderTopLeftRadius: '1vh', height: '50px', fontFamily: 'Lucida Sans', cursor: 'pointer', verticalAlign: 'middle', color: 'white' }
    const columns = [


        {
            style: { display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: 'max-content', height: '40px', padding: '0', margin: '0' },
            headerStyle: headerStyle,
            dataField: 'DETAILS',
            text: 'DETAILS',
            isDummyField: true,
            editable: false,
            classes: '',
            formatter: (cellContent, row) => {
                return (
                    <i class="bi bi-info-circle-fill information" onClick={cellContent => openModal(row.ID)} style={{ textAlign: 'center', verticalAlign: 'middle', padding: '2px', margin: '0' }} data-bs-toggle="modal" data-bs-target="#modalBuildings"></i>

                );
            },
        },
        colunas.ID,
        colunas.BUILD,
        colunas.COUNTRY,

    ];










    return (
        <>
            {loading == 1 || loading == 2 ?
                <div class='loader-background' >
                    <p>{loading == 1 ? 'Loading Buildings Table' : loading == 2 ? 'Loading Build Content' : ''}</p>
                    <div class="loader">
                    </div>

                </div>
                : <></>}




            <div class='page-build'>
                {dataBuildings.length > 1 ?
                    <Table dataDetails={dataBuildings} columnsDetails={columns} classTable={"tabelaLista"} searchBar='sim' />

                    : <></>}



            </div>

            <div class="modal fade " id="modalBuildings" tabindex="-2" aria-labelledby="exampleModalLabel" aria-hidden="true">

                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable .modal-xl ">


                    <div class="modal-content">
                        <div class="modal-header  ">
                            <div class='col-11 d-flex  justify-content-center p-0 m-0'>
                                <p class="modal-title " id="exampleModalLabel">{title !== '' ? title : ''}</p>
                            </div>
                            <button type="button" class="btn-close" id="closeCircuito" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="col-12 d-flex justify-content-center swtch-content p-2  ">
                                <input id="checkbox_toggle" name="check" type="checkbox" class="check"
                                    onChange={(e) => changeContent(e.target.checked)}   >
                                </input>

                                <div class="checkbox">
                                    <label class="slide" for="checkbox_toggle ">
                                        <label class="toggle" for="checkbox_toggle"></label>
                                        <label class="text" for="checkbox_toggle" >History</label>
                                        <label class="text" for="checkbox_toggle">Images</label>
                                    </label>
                                </div>
                            </div>
                        <div class={changeModal == false ? 'modal-body p-1 modal-body p-1 background' : 'modal-body p-1 modal-body p-1'}>

                            
                            <div class={changeModal == false && loading !== 0 ? 'build-information' : 'diplay-none'}>
                                <p>{description !== '' ? description : 'No description avaliable for this building untill now'}</p>
                            </div>
                            <div class={changeModal == true ? 'img-modal' : 'diplay-none'}>
                           {imagesModal  ? imagesModal : <></>}
                           </div>

                        </div>

                    </div>

                </div>
            </div>


        </>
    )
}



export default SculpPage;