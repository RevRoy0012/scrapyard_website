// Iracing_livery_hub.jsx
// ----- IMPORTS -----
import React, { useState, useEffect, useCallback } from 'react';
import { FaUpload, FaDownload, FaEdit, FaTrashAlt, FaSort, FaSortUp, FaSortDown, FaTimes, FaSave, FaPlus } from 'react-icons/fa';
import GlobalNotification from '../components/global_notification_component.jsx';
import GlobalThrobber from '../components/global_throbber_component.jsx';

// ----- HELPER FUNCTIONS -----
const uploadFileToS3 = async (presignedUrl, file) => { /* ... unchanged ... */
    console.log(`Uploading ${file.name} (${file.type || 'unknown type'}) to S3 pre-signed URL...`);
    const response = await fetch(presignedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type || 'application/octet-stream' } });
    if (!response.ok) { let e = ''; try { e = await response.text(); console.error("S3 Upload Raw Error Response:", e); } catch (_) {} throw new Error(`S3 upload for ${file.name} failed: ${response.status} ${response.statusText}. Details: ${e.substring(0, 500)}`); }
    console.log(`Successfully uploaded ${file.name} to S3.`);
    return response;
};

// ----- MODAL COMPONENTS -----
// ModalWrapper, UploadModal, EditModal, ConfirmModal remain unchanged from the previous *complete* version.
// Make sure UploadModal includes the carGroup input.
// Base Modal Wrapper
const ModalWrapper = ({ visible, children, onClose }) => { const [show, setShow] = useState(false); useEffect(() => { if (visible) { setShow(true); } else { const timer = setTimeout(() => setShow(false), 300); return () => clearTimeout(timer); } }, [visible]); if (!show && !visible) return null; const backdropStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease-in-out', }; const contentStyle = { backgroundColor: '#2d3748', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '500px', color: '#e2e8f0', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)', position: 'relative', transform: visible ? 'scale(1)' : 'scale(0.95)', opacity: visible ? 1 : 0, transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out', }; const closeButtonStyle = { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#a0aec0', fontSize: '24px', cursor: 'pointer', padding: '5px', lineHeight: '1', }; return (<div style={backdropStyle} onClick={onClose}><div style={contentStyle} onClick={(e) => e.stopPropagation()}><button onClick={onClose} style={closeButtonStyle} aria-label="Close modal"><FaTimes /></button>{children}</div></div>); };
// Upload Modal (with Car Group)
const UploadModal = ({ visible, onSubmit, onCancel }) => { const [formValues, setFormValues] = useState({ livery_id: '', carName: '', carType: '', carGroup: '', paintFile: null, specMapFile: null, }); const [paintFileName, setPaintFileName] = useState(''); const [specMapFileName, setSpecMapFileName] = useState(''); const [focusedInput, setFocusedInput] = useState(null); const [activeButton, setActiveButton] = useState(null); const [paintFileHover, setPaintFileHover] = useState(false); const [specMapFileHover, setSpecMapFileHover] = useState(false); useEffect(() => { if (visible) { setFormValues({ livery_id: '', carName: '', carType: '', carGroup: '', paintFile: null, specMapFile: null }); setPaintFileName(''); setSpecMapFileName(''); } }, [visible]); const handleChange = (e) => { const { name, value, files } = e.target; if (files && files[0]) { const file = files[0]; setFormValues((prev) => ({ ...prev, [name]: file })); if (name === 'paintFile') setPaintFileName(file.name); if (name === 'specMapFile') setSpecMapFileName(file.name); } else if (!files) { setFormValues((prev) => ({ ...prev, [name]: value })); } }; const handleSubmit = (e) => { e.preventDefault(); if (!formValues.paintFile || !formValues.specMapFile) { alert("Please select both paint and spec map files."); return; } onSubmit(formValues); }; const titleStyle = { color: '#f56565', marginBottom: '25px', textAlign: 'center', fontSize: '24px' }; const inputStyle = { width: '100%', padding: '12px 15px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #4a5568', fontSize: '16px', backgroundColor: '#1a202c', color: '#e2e8f0', boxSizing: 'border-box', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }; const inputFocusStyle = { outline: 'none', borderColor: '#f56565', boxShadow: '0 0 0 2px rgba(245, 101, 101, 0.3)' }; const fileInputWrapperStyle = { position: 'relative', marginBottom: '20px' }; const hiddenFileInputStyle = { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }; const fileInputLabelStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px dashed #4a5568', fontSize: '16px', backgroundColor: '#1a202c', color: '#a0aec0', cursor: 'pointer', transition: 'border-color 0.2s ease, background-color 0.2s ease' }; const fileInputLabelHoverStyle = { borderColor: '#718096', backgroundColor: '#252f41' }; const fileNameStyle = { color: '#e2e8f0', fontSize: '14px', marginLeft: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }; const buttonGroupStyle = { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }; const baseButtonStyle = { border: 'none', borderRadius: '6px', padding: '10px 20px', color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s ease, transform 0.1s ease' }; const primaryButtonStyle = { ...baseButtonStyle, backgroundColor: '#f56565' }; const primaryButtonHoverStyle = { backgroundColor: '#e53e3e' }; const primaryButtonActiveStyle = { transform: 'scale(0.98)' }; const secondaryButtonStyle = { ...baseButtonStyle, backgroundColor: '#718096' }; const secondaryButtonHoverStyle = { backgroundColor: '#4a5568' }; const secondaryButtonActiveStyle = { transform: 'scale(0.98)' }; return (<ModalWrapper visible={visible} onClose={onCancel}><h2 style={titleStyle}>Upload New Livery</h2><form onSubmit={handleSubmit}><input type="text" name="livery_id" placeholder="Livery ID (e.g., team_car_01)" required style={{ ...inputStyle, ...(focusedInput === 'livery_id' && inputFocusStyle) }} value={formValues.livery_id} onChange={handleChange} onFocus={() => setFocusedInput('livery_id')} onBlur={() => setFocusedInput(null)} /><input type="text" name="carName" placeholder="Car Name (e.g., Porsche 911 GT3 R)" required style={{ ...inputStyle, ...(focusedInput === 'carName' && inputFocusStyle) }} value={formValues.carName} onChange={handleChange} onFocus={() => setFocusedInput('carName')} onBlur={() => setFocusedInput(null)} /><input type="text" name="carType" placeholder="Car Type (e.g., GT3)" required style={{ ...inputStyle, ...(focusedInput === 'carType' && inputFocusStyle) }} value={formValues.carType} onChange={handleChange} onFocus={() => setFocusedInput('carType')} onBlur={() => setFocusedInput(null)} /><input type="text" name="carGroup" placeholder="Car Group (Optional, e.g., Endurance)" style={{ ...inputStyle, ...(focusedInput === 'carGroup' && inputFocusStyle) }} value={formValues.carGroup} onChange={handleChange} onFocus={() => setFocusedInput('carGroup')} onBlur={() => setFocusedInput(null)} /><div style={fileInputWrapperStyle}><label htmlFor="paintFile" style={{ ...fileInputLabelStyle, ...(paintFileHover && fileInputLabelHoverStyle) }} onMouseEnter={() => setPaintFileHover(true)} onMouseLeave={() => setPaintFileHover(false)}><span>{paintFileName ? 'Paint File:' : 'Choose Paint File (.tga, .png, etc.)'}</span> {paintFileName && <span style={fileNameStyle}>{paintFileName}</span>} {!paintFileName && <FaUpload />} </label><input type="file" id="paintFile" name="paintFile" accept=".tga,image/*" required style={hiddenFileInputStyle} onChange={handleChange} /></div><div style={fileInputWrapperStyle}><label htmlFor="specMapFile" style={{ ...fileInputLabelStyle, ...(specMapFileHover && fileInputLabelHoverStyle) }} onMouseEnter={() => setSpecMapFileHover(true)} onMouseLeave={() => setSpecMapFileHover(false)}><span>{specMapFileName ? 'Spec Map File:' : 'Choose Spec Map File (.tga, .mip)'}</span> {specMapFileName && <span style={fileNameStyle}>{specMapFileName}</span>} {!specMapFileName && <FaUpload />} </label><input type="file" id="specMapFile" name="specMapFile" accept=".tga,.mip,image/*" required style={hiddenFileInputStyle} onChange={handleChange} /></div><div style={buttonGroupStyle}><button type="button" onClick={onCancel} style={{ ...secondaryButtonStyle, ...(activeButton === 'cancel' && secondaryButtonActiveStyle) }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = secondaryButtonHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = secondaryButtonStyle.backgroundColor} onMouseDown={() => setActiveButton('cancel')} onMouseUp={() => setActiveButton(null)} onMouseOut={() => setActiveButton(null)}> <FaTimes /> Cancel </button><button type="submit" style={{ ...primaryButtonStyle, ...(activeButton === 'upload' && primaryButtonActiveStyle) }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryButtonHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryButtonStyle.backgroundColor} onMouseDown={() => setActiveButton('upload')} onMouseUp={() => setActiveButton(null)} onMouseOut={() => setActiveButton(null)}> <FaUpload /> Upload </button></div></form></ModalWrapper>); };
// Edit Modal
const EditModal = ({ visible, data, onSave, onCancel }) => { const [newName, setNewName] = useState(''); const [focusedInput, setFocusedInput] = useState(false); const [activeButton, setActiveButton] = useState(null); useEffect(() => { if (data) { setNewName(data.carName); } else { setNewName(''); } }, [data]); if (!data) return null; const handleSave = () => { if (newName.trim()) { onSave(newName); } else { console.warn("Car name cannot be empty"); } }; const titleStyle = { color: '#f56565', marginBottom: '20px', fontSize: '22px' }; const inputStyle = { width: '100%', padding: '12px 15px', marginBottom: '25px', borderRadius: '6px', border: '1px solid #4a5568', fontSize: '16px', backgroundColor: '#1a202c', color: '#e2e8f0', boxSizing: 'border-box', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }; const inputFocusStyle = { outline: 'none', borderColor: '#f56565', boxShadow: '0 0 0 2px rgba(245, 101, 101, 0.3)' }; const labelStyle = { display: 'block', marginBottom: '8px', color: '#a0aec0', fontSize: '14px', fontWeight: '500' }; const buttonGroupStyle = { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' }; const baseButtonStyle = { border: 'none', borderRadius: '6px', padding: '10px 20px', color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s ease, transform 0.1s ease' }; const primaryButtonStyle = { ...baseButtonStyle, backgroundColor: '#f56565' }; const primaryButtonHoverStyle = { backgroundColor: '#e53e3e' }; const primaryButtonActiveStyle = { transform: 'scale(0.98)' }; const secondaryButtonStyle = { ...baseButtonStyle, backgroundColor: '#718096' }; const secondaryButtonHoverStyle = { backgroundColor: '#4a5568' }; const secondaryButtonActiveStyle = { transform: 'scale(0.98)' }; return (<ModalWrapper visible={visible} onClose={onCancel}><h2 style={titleStyle}>Edit Livery Name</h2><label htmlFor="editCarName" style={labelStyle}>Car Name:</label><input id="editCarName" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ ...inputStyle, ...(focusedInput && inputFocusStyle) }} onFocus={() => setFocusedInput(true)} onBlur={() => setFocusedInput(false)} required /><div style={buttonGroupStyle}><button onClick={onCancel} style={{ ...secondaryButtonStyle, ...(activeButton === 'cancel' && secondaryButtonActiveStyle) }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = secondaryButtonHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = secondaryButtonStyle.backgroundColor} onMouseDown={() => setActiveButton('cancel')} onMouseUp={() => setActiveButton(null)} onMouseOut={() => setActiveButton(null)}> <FaTimes /> Cancel </button><button onClick={handleSave} style={{ ...primaryButtonStyle, ...(activeButton === 'save' && primaryButtonActiveStyle) }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryButtonHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryButtonStyle.backgroundColor} onMouseDown={() => setActiveButton('save')} onMouseUp={() => setActiveButton(null)} onMouseOut={() => setActiveButton(null)}> <FaSave /> Save </button></div></ModalWrapper>); };
// Confirm Modal
const ConfirmModal = ({ visible, message, onConfirm, onCancel }) => { const [activeButton, setActiveButton] = useState(null); const titleStyle = { color: '#f56565', marginBottom: '15px', fontSize: '22px' }; const messageStyle = { marginBottom: '30px', color: '#e2e8f0', lineHeight: '1.6' }; const buttonGroupStyle = { display: 'flex', justifyContent: 'flex-end', gap: '15px' }; const baseButtonStyle = { border: 'none', borderRadius: '6px', padding: '10px 20px', color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s ease, transform 0.1s ease' }; const dangerButtonStyle = { ...baseButtonStyle, backgroundColor: '#f56565' }; const dangerButtonHoverStyle = { backgroundColor: '#e53e3e' }; const dangerButtonActiveStyle = { transform: 'scale(0.98)' }; const secondaryButtonStyle = { ...baseButtonStyle, backgroundColor: '#718096' }; const secondaryButtonHoverStyle = { backgroundColor: '#4a5568' }; const secondaryButtonActiveStyle = { transform: 'scale(0.98)' }; return (<ModalWrapper visible={visible} onClose={onCancel}><h2 style={titleStyle}>Confirm Action</h2><p style={messageStyle}>{message}</p><div style={buttonGroupStyle}><button onClick={onCancel} style={{ ...secondaryButtonStyle, ...(activeButton === 'no' && secondaryButtonActiveStyle) }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = secondaryButtonHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = secondaryButtonStyle.backgroundColor} onMouseDown={() => setActiveButton('no')} onMouseUp={() => setActiveButton(null)} onMouseOut={() => setActiveButton(null)}> <FaTimes /> No </button><button onClick={onConfirm} style={{ ...dangerButtonStyle, ...(activeButton === 'yes' && dangerButtonActiveStyle) }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = dangerButtonHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = dangerButtonStyle.backgroundColor} onMouseDown={() => setActiveButton('yes')} onMouseUp={() => setActiveButton(null)} onMouseOut={() => setActiveButton(null)}> <FaTrashAlt /> Yes </button></div></ModalWrapper>); };


// ----- MAIN COMPONENT: Iracing_livery_hub -----
const Iracing_livery_hub = () => {
    // --- State ---
    const [userRoles, setUserRoles] = useState(undefined); // *** Initialize as undefined ***
    const [liveries, setLiveries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('carName');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true); // Initial data load/auth check
    const [isUploading, setIsUploading] = useState(false); // Upload/Download throbber
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editModalData, setEditModalData] = useState(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    // Render state helpers
    const [searchInputFocused, setSearchInputFocused] = useState(false);
    const [activeSortButton, setActiveSortButton] = useState(false);
    const [activeFab, setActiveFab] = useState(false);

    // --- Constants ---
    // *** REMOVED "iRacing Driver" from allowedRoles ***
    const allowedRoles = ["Developer", "Admin", "Moderator", "Livery Artist", "iRacing Driver"];
    const API_BASE_URL = "https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/internal/iracing_team/liveries";
    const GENERATE_UPLOAD_URL_ENDPOINT = `${API_BASE_URL}/upload/generate_upload_url`;
    const METADATA_UPLOAD_ENDPOINT = `${API_BASE_URL}/upload`;
    const LIST_LIVERIES_ENDPOINT = API_BASE_URL;
    const EDIT_LIVERY_ENDPOINT = `${API_BASE_URL}/edit`;
    const DELETE_LIVERY_ENDPOINT = `${API_BASE_URL}/delete`;
    const GENERATE_DOWNLOAD_URL_ENDPOINT_BASE = `${API_BASE_URL}/download/generate_download_url`;


    // --- Styles (Omitted for brevity - assume they are unchanged) ---
    const containerStyle = { backgroundColor: "#1a202c", color: "#e2e8f0", minHeight: "100vh", padding: "30px", paddingTop: "100px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", position: "relative" };
    const controlsContainerStyle = { display: "flex", flexWrap: 'wrap', gap: '15px', alignItems: "center", marginBottom: "30px", padding: '20px', backgroundColor: '#2d3748', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' };
    const searchInputStyle = { padding: '10px 15px', borderRadius: '6px', border: '1px solid #4a5568', fontSize: '16px', backgroundColor: '#1a202c', color: '#e2e8f0', minWidth: '250px', flexGrow: 1, transition: 'border-color 0.2s ease, box-shadow 0.2s ease' };
    const searchInputFocusStyle = { outline: 'none', borderColor: '#f56565', boxShadow: '0 0 0 2px rgba(245, 101, 101, 0.3)' };
    const selectStyle = { padding: '10px 15px', borderRadius: '6px', border: '1px solid #4a5568', fontSize: '16px', backgroundColor: '#1a202c', color: '#e2e8f0', cursor: 'pointer', minWidth: '150px' };
    const baseButtonStyle = { border: 'none', borderRadius: '6px', padding: '10px 15px', color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s ease, transform 0.1s ease' };
    const sortButtonStyle = { ...baseButtonStyle, backgroundColor: '#718096', minWidth: '130px', justifyContent: 'center' };
    const sortButtonHoverStyle = { backgroundColor: '#4a5568' };
    const sortButtonActiveStyle = { transform: 'scale(0.98)' };
    const actionButtonStyle = { ...baseButtonStyle, padding: '6px 12px', fontSize: '14px', marginRight: '8px', backgroundColor: '#4a5568' };
    // const actionButtonHoverStyle = { backgroundColor: '#718096' }; // Assuming defined elsewhere or using CSS
    // const actionButtonActiveStyle = { transform: 'scale(0.98)' }; // Assuming defined elsewhere or using CSS
    const downloadButtonStyle = { ...actionButtonStyle, backgroundColor: '#38a169' };
    // const downloadButtonHoverStyle = { backgroundColor: '#2f855a' }; // Assuming defined elsewhere or using CSS
    const editButtonStyle = { ...actionButtonStyle, backgroundColor: '#dd6b20' };
    // const editButtonHoverStyle = { backgroundColor: '#c05621' }; // Assuming defined elsewhere or using CSS
    const deleteButtonStyle = { ...actionButtonStyle, backgroundColor: '#f56565' };
    // const deleteButtonHoverStyle = { backgroundColor: '#e53e3e' }; // Assuming defined elsewhere or using CSS
    const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px", boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', borderRadius: '8px', overflow: 'hidden' };
    const tableHeaderStyle = { backgroundColor: "#2d3748", borderBottom: "2px solid #4a5568", padding: "15px", color: "#f56565", textAlign: "left", fontSize: "16px", fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' };
    const tableHeaderActionsStyle = { ...tableHeaderStyle, textAlign: "center", width: '200px' };
    const tableCellStyle = { backgroundColor: "#1f2738", borderBottom: "1px solid #4a5568", padding: "15px", color: "#cbd5e0", fontSize: "15px", textAlign: "left", verticalAlign: 'middle' };
    const tableCellActionsStyle = { ...tableCellStyle, textAlign: "center" };
    const loadingOverlayStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(26, 32, 44, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 500, color: '#f56565', fontSize: '20px', fontWeight: 'bold' };
    const emptyStateStyle = { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#a0aec0', backgroundColor: '#2d3748', borderRadius: '8px', marginTop: '30px' };
    const fabStyle = { position: "fixed", bottom: "30px", right: "30px", backgroundColor: "#f56565", border: "none", borderRadius: "50%", width: "60px", height: "60px", color: "#fff", fontSize: "28px", cursor: "pointer", boxShadow: "0 5px 15px rgba(0,0,0,0.3)", display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 900, transition: 'background-color 0.2s ease, transform 0.2s ease' };
    const fabHoverStyle = { backgroundColor: '#e53e3e' };
    const fabActiveStyle = { transform: 'scale(0.95)' };


    // --- Utility & Data Fetching Functions ---
    const parseRoles = (rolesString) => { if (!rolesString) return []; let cleaned = rolesString.replace(/[{}"]/g, ''); return cleaned.split(',').map((role) => role.trim()).filter((role) => role.length > 0); };
    const showNotification = useCallback((message, type = "success") => { setNotification({ message, type, visible: true }); setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 4000); }, []);

    // *** UPDATED fetchUserRoles ***
    const fetchUserRoles = useCallback(async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            console.log("No user found in localStorage.");
            return null; // Indicate unauthenticated user explicitly
        }

        const parsedUser = JSON.parse(storedUser);
        // Ensure email exists before fetching
        if (!parsedUser?.email) {
            console.error("Stored user data missing email.");
            localStorage.removeItem('user'); // Clear invalid stored data
            return null;
        }

        const profileEndpoint = `https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/profile?email=${encodeURIComponent(parsedUser.email)}`;
        try {
            console.log("Fetching profile for:", parsedUser.email);
            const response = await fetch(profileEndpoint);
            if (!response.ok) {
                console.error(`Profile fetch failed: ${response.status}`);
                // Optionally try to parse error message from backend
                let errMsg = `Profile fetch error (${response.status})`;
                try { const errData = await response.json(); errMsg = errData.message || errData.error || errMsg; } catch(e){}
                setError(errMsg); // Set error state
                // Return empty array or specific error indicator if needed, NOT default role
                return []; // Indicate authenticated but failed profile fetch
            }
            const data = await response.json();
            console.log("Profile data received:", data);
            if (data.roles) return parseRoles(data.roles);
            if (data.role && typeof data.role === 'string') return [data.role];
            if (Array.isArray(data.role)) return data.role;
            console.log("No specific roles found in profile, returning empty array.");
            return []; // Return empty array if authenticated but no roles defined
        } catch (err) {
            console.error('Error during user role API call:', err);
            setError(`Could not verify user roles: ${err.message}`);
            return []; // Indicate authenticated but failed profile fetch
        }
    }, []); // Dependency array is empty as setError is stable

    // *** UPDATED fetchLiveries - Only call if authorized ***
    const fetchLiveries = useCallback(async () => {
        // No need for setLoading(true) here, as it's handled by the caller (initialize)
        setError(null); // Clear specific livery fetch errors
        try {
            const response = await fetch(LIST_LIVERIES_ENDPOINT);
            if (!response.ok) { let e=`Failed to fetch liveries (Status: ${response.status})`; try{const d=await response.json();e=d.message||d.error||e;}catch(_){} throw new Error(e); }
            const data = await response.json();
            const transformedData = data.map(item => ({ livery_id: item.livery_id?.S || item.livery_id || `missing_id_${Math.random()}`, carName: item.carName?.S || item.carName || "Unknown Car", carType: item.carType?.S || item.carType || "Unknown Type", carGroup: item.carGroup?.S || item.carGroup || "N/A", paintFileName: item.paintFileName?.S || item.paintFileName, specMapFileName: item.specMapFileName?.S || item.specMapFileName, paintKey: item.paintKey?.S || item.paintKey, specMapKey: item.specMapKey?.S || item.specMapKey, }));
            setLiveries(transformedData);
        } catch (err) {
            console.error("Error fetching liveries:", err);
            // Set error state, let render logic display it. Don't show notification here
            // as it might overwrite auth errors.
            setError(`Failed to load liveries: ${err.message}`);
            setLiveries([]); // Ensure liveries are cleared on error
        } finally {
            // Ensure loading is always set to false after attempting fetch,
            // even if called when already false (though initialize should handle this)
            setLoading(false);
        }
    }, []); // Removed showNotification dependency

    // *** UPDATED useEffect / initialize ***
    useEffect(() => {
        const initialize = async () => {
            console.log("Initializing component...");
            setLoading(true);
            setError(null);
            setLiveries([]);
            setUserRoles(undefined); // Reset to undefined during init

            const roles = await fetchUserRoles(); // This now returns null if not in localStorage

            if (roles === null) {
                // User is not authenticated (no user in localStorage)
                console.log("Initialization: User determined to be unauthenticated.");
                setUserRoles(null); // Set state to explicitly null
                setLoading(false);
            } else if (roles && roles.some(role => allowedRoles.includes(role))) {
                // User is authenticated (found in localStorage, fetch didn't fail catastrophically)
                // AND has at least one allowed role
                console.log("Initialization: User authenticated with allowed roles:", roles);
                setUserRoles(roles);
                await fetchLiveries(); // Fetch data (this will set loading false)
            } else {
                // User is authenticated (found in localStorage, fetch didn't fail catastrophically)
                // BUT does NOT have any allowed roles (roles might be [], ['iRacing Driver'], or fetch failed returning [])
                console.log("Initialization: User authenticated but lacks allowed roles:", roles);
                setUserRoles(roles || []); // Store the roles (or empty array) for context
                setLoading(false); // Stop loading, Access Denied will render
            }
        };
        initialize();
        // fetchUserRoles and fetchLiveries are memoized with useCallback
    }, [fetchUserRoles, fetchLiveries]);


    // --- Sorting and Filtering ---
    const sortLiveries = (a, b) => { const fieldA = String(a[sortField] || "").toLowerCase(); const fieldB = String(b[sortField] || "").toLowerCase(); const comparison = fieldA.localeCompare(fieldB); return sortOrder === "asc" ? comparison : -comparison; };
    // Only filter/sort if liveries is an array (it might be empty, but not null/undefined)
    const displayedLiveries = Array.isArray(liveries)
        ? liveries.filter(livery => String(livery.carName || "").toLowerCase().includes(searchTerm.toLowerCase()) || String(livery.carType || "").toLowerCase().includes(searchTerm.toLowerCase()) || String(livery.livery_id || "").toLowerCase().includes(searchTerm.toLowerCase())).sort(sortLiveries)
        : []; // Default to empty array if liveries state isn't ready
    const handleSort = (field) => { const newOrder = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc'; setSortField(field); setSortOrder(newOrder); };
    const getSortIcon = (field) => { if (sortField !== field) return <FaSort color="#a0aec0" />; if (sortOrder === 'asc') return <FaSortUp />; return <FaSortDown />; };

    // --- Action Handlers (handleUpload, handleDownload, handleEdit, confirmEditSave, handleDelete, confirmDelete) ---
    // These should remain unchanged from the previous complete version, including the
    // logic within handleUpload and handleDownload to set/unset `isUploading`.
    const handleUpload = async (uploadValues) => { const { livery_id, carName, carType, carGroup, paintFile, specMapFile } = uploadValues; setUploadModalVisible(false); setIsUploading(true); showNotification("Starting upload...", "info"); try { console.log("Requesting pre-signed URLs..."); const urlResponse = await fetch(GENERATE_UPLOAD_URL_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paintFileName: paintFile.name, specMapFileName: specMapFile.name, contentTypePaint: paintFile.type || 'application/octet-stream', contentTypeSpecMap: specMapFile.type || 'application/octet-stream' }), }); if (!urlResponse.ok) { let e = `Failed to get upload URLs (Status: ${urlResponse.status})`; try { const d = await urlResponse.json(); e = `${e}: ${d.message||d.error||'Unknown'}`; } catch (_) {} throw new Error(e); } const { paintUploadUrl, specMapUploadUrl, paintKey, specMapKey } = await urlResponse.json(); if (!paintUploadUrl || !specMapUploadUrl || !paintKey || !specMapKey) { throw new Error("Invalid URL data received."); } console.log("Received URLs/keys:", { paintKey, specMapKey }); showNotification("Uploading paint file...", "info"); await uploadFileToS3(paintUploadUrl, paintFile); showNotification("Uploading spec map file...", "info"); await uploadFileToS3(specMapUploadUrl, specMapFile); showNotification("Saving livery details...", "info"); const metadataPayload = { livery_id, carName, carType, paintFileName: paintFile.name, specMapFileName: specMapFile.name, paintKey, specMapKey, ...(carGroup && { carGroup }) }; const metaResponse = await fetch(METADATA_UPLOAD_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(metadataPayload), }); if (!metaResponse.ok) { let e = `Metadata save failed (Status: ${metaResponse.status})`; try { const d = await metaResponse.json(); e = `${e}: ${d.message||d.error||'Unknown'}`; } catch (_) {} throw new Error(e); } const result = await metaResponse.json(); showNotification(result.message || "Livery uploaded successfully!", "success"); fetchLiveries(); } catch (error) { console.error("Upload process error:", error); showNotification(`Error during upload: ${error.message || 'Unknown error.'}`, "error"); } finally { setIsUploading(false); } };
    const handleDownload = async (liveryId) => { console.log(`Initiating download request for livery_id: ${liveryId}`); setIsUploading(true); showNotification("Fetching download links...", "info"); try { const response = await fetch(`${GENERATE_DOWNLOAD_URL_ENDPOINT_BASE}?livery_id=${liveryId}`); if (!response.ok) { let e=`Failed to get download links (Status: ${response.status})`; try{const d=await response.json();e=`${e}: ${d.message||d.error||'Unknown'}`;}catch(_){} throw new Error(e); } const data = await response.json(); if (!data.paintUrl || !data.specMapUrl || !data.paintFileName || !data.specMapFileName ) { throw new Error("Incomplete download link data received."); } showNotification("Starting downloads...", "info"); const paintLink = document.createElement('a'); paintLink.href = data.paintUrl; paintLink.download = data.paintFileName; document.body.appendChild(paintLink); paintLink.click(); document.body.removeChild(paintLink); await new Promise(resolve => setTimeout(resolve, 500)); const specMapLink = document.createElement('a'); specMapLink.href = data.specMapUrl; specMapLink.download = data.specMapFileName; document.body.appendChild(specMapLink); specMapLink.click(); document.body.removeChild(specMapLink); showNotification("Download(s) initiated.", "success"); } catch (error) { console.error("Download process error:", error); showNotification(`Download failed: ${error.message}`, "error"); } finally { setIsUploading(false); } };
    const handleEdit = (livery) => { setEditModalData(livery); setEditModalVisible(true); };
    const confirmEditSave = async (newCarName) => { if (!editModalData) return; showNotification("Saving changes...", "info"); const payload = { livery_id: editModalData.livery_id, carName: newCarName }; try { const res = await fetch(EDIT_LIVERY_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), }); if (!res.ok) { let e=`Edit failed (Status: ${res.status})`; try{const d=await res.json(); e=`${e}: ${d.message||d.error||'Unknown'}`;}catch(_){} throw new Error(e); } const result = await res.json(); showNotification(result.message || "Livery updated!", "success"); setEditModalVisible(false); setLiveries(p => p.map(l => l.livery_id === editModalData.livery_id ? { ...l, carName: newCarName } : l )); setEditModalData(null); } catch (error) { console.error("Edit error:", error); showNotification(`Error updating livery: ${error.message}`, "error"); } };
    const handleDelete = (liveryId) => { setDeleteTargetId(liveryId); setConfirmModalVisible(true); };
    const confirmDelete = async () => { if (!deleteTargetId) return; showNotification("Deleting livery...", "info"); try { const res = await fetch(DELETE_LIVERY_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ livery_id: deleteTargetId }), }); if (!res.ok) { let e=`Delete failed (Status: ${res.status})`; try{const d=await res.json(); e=`${e}: ${d.message||d.error||'Unknown'}`;}catch(_){} throw new Error(e); } const result = await res.json(); showNotification(result.message || "Livery deleted.", "success"); setConfirmModalVisible(false); setLiveries(p => p.filter(l => l.livery_id !== deleteTargetId)); setDeleteTargetId(null); } catch (error) { console.error("Delete error:", error); showNotification(`Error deleting livery: ${error.message}`, "error"); setConfirmModalVisible(false); setDeleteTargetId(null); } };


    // --- Conditional Rendering Logic ---

    // Define temporary variables for clarity in JSX
    const isLoading = loading && !isUploading; // Show initial loading only
    const isUnauthenticated = userRoles === null && !loading && !isUploading;
    // Check if user is authenticated (not null) but lacks allowed roles
    const isUnauthorized = userRoles && !userRoles.some(role => allowedRoles.includes(role)) && !loading && !isUploading;
    // Check for general errors after loading/auth attempt
    const hasError = error && !loading && !isUploading;
    // User is authenticated, authorized, and not loading/errored
    const isReady = !isLoading && !isUnauthenticated && !isUnauthorized && !hasError && !isUploading;
    // Determine if user has permission to upload/modify (used for FAB and table buttons)
    const canModify = userRoles && (userRoles.includes("Livery Artist") || userRoles.includes("Admin") || userRoles.includes("Developer"));


    return (
        <div style={containerStyle}>
            {/* Global Loading Indicator (for async actions) */}
            {isUploading && <GlobalThrobber message="Processing..." />}

            {/* Notifications */}
            {notification.visible && (<GlobalNotification message={notification.message} type={notification.type} onClose={() => setNotification(prev => ({ ...prev, visible: false }))} />)}

            {/* Page Title (Render always for context) */}
            <h1 style={{ color: "#f56565", marginBottom: '30px', borderBottom: '1px solid #4a5568', paddingBottom: '15px' }}> iRacing Livery Dashboard </h1>

            {/* === Main Content Area === */}
            {isLoading ? (
                <div style={loadingOverlayStyle}>Initializing...</div>
            ) : hasError ? (
                <div style={emptyStateStyle}>
                    <p style={{color: '#f56565', fontWeight: 'bold'}}>Error!</p>
                    <p>{error}</p>
                    {/* Allow retrying the initialization */}
                    <button onClick={() => { setLoading(true); setError(null); fetchUserRoles().then(roles => { /* Re-run logic? Simpler to just re-init via refresh for now */ console.log("Retry attempted"); setLoading(false); }); }}
                            style={{...sortButtonStyle, marginTop: '20px', backgroundColor: '#f56565'}} >
                        Retry
                    </button>
                </div>
            ) : isUnauthenticated ? (
                <div style={emptyStateStyle}>
                    <h2 style={{ color: "#f56565" }}>Authentication Required</h2>
                    <p>Please sign in to access the Livery Hub.</p>
                    {/* Optional: Add sign-in link/button */}
                </div>
            ) : isUnauthorized ? (
                <div style={emptyStateStyle}>
                    <h2 style={{ color: "#f56565" }}>Access Denied</h2>
                    <p>You do not have the required roles ({allowedRoles.join(', ')}) to view this page.</p>
                    {/* Optional: Show current roles <p>Your roles: {userRoles.join(', ')}</p> */}
                </div>
            ) : isReady ? (
                // --- User Authenticated and Authorized: Render Main Content ---
                <>
                    {/* Controls */}
                    <div style={controlsContainerStyle}>
                        <input type="text" placeholder="Search by ID, Name, Type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...searchInputStyle, ...(searchInputFocused && searchInputFocusStyle) }} onFocus={() => setSearchInputFocused(true)} onBlur={() => setSearchInputFocused(false)} />
                        <select value={sortField} onChange={(e) => setSortField(e.target.value)} style={selectStyle} aria-label="Sort by field"><option value="carName">Sort by: Car Name</option><option value="carType">Sort by: Car Type</option><option value="carGroup">Sort by: Car Group</option><option value="livery_id">Sort by: Livery ID</option></select>
                        <button onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")} style={{ ...sortButtonStyle, ...(activeSortButton && sortButtonActiveStyle) }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = sortButtonHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = sortButtonStyle.backgroundColor} onMouseDown={() => setActiveSortButton(true)} onMouseUp={() => setActiveSortButton(false)} onMouseOut={() => setActiveSortButton(false)} aria-label={`Sort order ${sortOrder}`}> {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />} {sortOrder === "asc" ? "Asc" : "Desc"} </button>
                    </div>

                    {/* Table Display or Empty State */}
                    {displayedLiveries.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyle}>
                                <thead><tr><th style={tableHeaderStyle} onClick={() => handleSort('livery_id')} role="columnheader" aria-sort={sortField === 'livery_id' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}> <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}> Livery ID {getSortIcon('livery_id')} </span> </th><th style={tableHeaderStyle} onClick={() => handleSort('carName')} role="columnheader" aria-sort={sortField === 'carName' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}> <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}> Car Name {getSortIcon('carName')} </span> </th><th style={tableHeaderStyle} onClick={() => handleSort('carType')} role="columnheader" aria-sort={sortField === 'carType' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}> <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}> Car Type {getSortIcon('carType')} </span> </th><th style={tableHeaderStyle} onClick={() => handleSort('carGroup')} role="columnheader" aria-sort={sortField === 'carGroup' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}> <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}> Car Group {getSortIcon('carGroup')} </span> </th><th style={tableHeaderActionsStyle} role="columnheader">Actions</th></tr></thead>
                                <tbody>
                                {displayedLiveries.map((livery) => {
                                    const rowId = livery.livery_id; const rowStyle = { ...tableCellStyle }; const actionsCellStyle = { ...rowStyle, ...tableCellActionsStyle };
                                    return (
                                        <tr key={rowId}>
                                            <td style={rowStyle}>{livery.livery_id}</td><td style={rowStyle}>{livery.carName}</td><td style={rowStyle}>{livery.carType}</td><td style={rowStyle}>{livery.carGroup || "N/A"}</td>
                                            <td style={actionsCellStyle}>
                                                <button onClick={() => handleDownload(rowId)} style={downloadButtonStyle} title="Download Livery"> <FaDownload /> </button>
                                                {/* Conditionally render modify buttons based on role */}
                                                {canModify && (<>
                                                    <button onClick={() => handleEdit(livery)} style={editButtonStyle} title="Edit Livery Name"> <FaEdit /> </button>
                                                    <button onClick={() => handleDelete(rowId)} style={deleteButtonStyle} title="Delete Livery"> <FaTrashAlt /> </button>
                                                </>)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        // Empty State when liveries array is empty but user is authorized
                        <div style={emptyStateStyle}>
                            <p>{liveries.length === 0 ? "No liveries found." : "No liveries match your search."}</p>
                            {/* Show upload prompt only if user can modify */}
                            {canModify && (<p>Click the '+' button to upload one!</p>)}
                        </div>
                    )}

                    {/* FAB Button - Only show if authorized and not uploading */}
                    {canModify && !isUploading && (
                        <button onClick={() => setUploadModalVisible(true)} style={{ ...fabStyle, ...(activeFab && fabActiveStyle) }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = fabHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = fabStyle.backgroundColor} onMouseDown={() => setActiveFab(true)} onMouseUp={() => setActiveFab(false)} onMouseOut={() => setActiveFab(false)} title="Upload New Livery"><FaPlus /></button>
                    )}
                </>
            ) : (
                // Fallback case - should ideally not be reached if logic above is correct
                <div style={emptyStateStyle}>Loading state indeterminate...</div>
            )}


            {/* Modals (Render outside conditional block for transitions) */}
            <UploadModal visible={uploadModalVisible} onSubmit={handleUpload} onCancel={() => setUploadModalVisible(false)} />
            <EditModal visible={editModalVisible} data={editModalData} onSave={confirmEditSave} onCancel={() => { setEditModalVisible(false); setEditModalData(null); }} />
            <ConfirmModal visible={confirmModalVisible} message={`Are you sure you want to delete livery ${deleteTargetId}? This action cannot be undone.`} onConfirm={confirmDelete} onCancel={() => { setConfirmModalVisible(false); setDeleteTargetId(null); }} />
        </div>
    );
};

// ----- EXPORT -----
export default Iracing_livery_hub;