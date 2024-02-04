import React, { useEffect, useState } from 'react';
import '../App.css';
import './PathSelect.css';
import { Modal } from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CustomTextField from './CustomTextField';

const PathSelect = ({ name, details, required, values, setValues }) => {
    const [dirs, setDirs] = useState("");
    const [selected, setSelected] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setValues({
            ...values,
            [name]: selected,
        });
        setOpenModal(false);
    };

    async function getDirs() {
        const resp = await fetch("http://localhost:3002/dirs", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!resp.ok) {
            console.log("Error in getting directories");
        }
    
        const data = await resp.json();
        setDirs(data);
    }
    
    useEffect(() => {
        getDirs();
    },[]);

    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.path} label={nodes.name}>
            {Array.isArray(nodes.children)
            ? nodes.children.map((node) => renderTree(node))
            : null}
        </TreeItem>
    );

    return (
        <div>
        <div className='path-select'>
            <CustomTextField
            help={details.help}
            type="text"
            id={name+"-path"}
            name={name}
            value={name in values ? values[name] : ""}
            required={required}
            placeholder='Click to select path'
            readOnly
            onClick={handleOpenModal}
            />
        </div>
        <div className='modal'>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
            >
                <div className='tree-view-outer'>
                    <div className='tree-view'>
                        <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpanded={['root']}
                        defaultExpandIcon={<ChevronRightIcon />}
                        onNodeSelect={(e, nodeId) => {
                            console.log(e.target);
                            setSelected(nodeId);
                        }}
                        >
                        {renderTree(dirs)}
                        </TreeView>
                    </div>
                </div>
            </Modal>
        </div>
        </div>
    );
}
 
export default PathSelect;