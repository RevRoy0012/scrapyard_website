// iRacing_livery_hub.jsx
import React, { useState, useEffect, useCallback } from 'react';
import GlobalNotification from '../components/global_notification_component.jsx';
import { FaUpload, FaDownload, FaEdit, FaTrashAlt, FaSort, FaSortUp, FaSortDown, FaTimes, FaSave, FaPlus } from 'react-icons/fa';

// --- Helper Functions ---
const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
    });

// --- Custom Modal Components ---
// ModalWrapper, UploadModal, EditModal, ConfirmModal remain unchanged from your last version
// ... (Keep ModalWrapper, UploadModal, EditModal, ConfirmModal code here) ...
// Base Modal Wrapper for consistent look and transitions
const ModalWrapper = ({ visible, children, onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (visible) {
            setShow(true);
        } else {
            // Allow transition out before removing from DOM
            const timer = setTimeout(() => setShow(false), 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!show && !visible) return null; // Don't render if not visible and transition finished

    const backdropStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker backdrop
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
    };

    const contentStyle = {
        backgroundColor: '#2d3748', // bg-gray-800
        padding: '30px', // Increased padding
        borderRadius: '8px', // Slightly larger radius
        width: '90%',
        maxWidth: '500px', // Max width for larger screens
        color: '#e2e8f0', // Lighter gray text (slate-200)
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        position: 'relative', // For close button positioning
        transform: visible ? 'scale(1)' : 'scale(0.95)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        color: '#a0aec0', // gray-500
        fontSize: '24px',
        cursor: 'pointer',
        padding: '5px',
        lineHeight: '1',
    };

    return (
        <div style={backdropStyle} onClick={onClose}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                {/* Added a close button */}
                <button onClick={onClose} style={closeButtonStyle} aria-label="Close modal">
                    <FaTimes />
                </button>
                {children}
            </div>
        </div>
    );
};


const UploadModal = ({ visible, onSubmit, onCancel }) => {
    const [formValues, setFormValues] = useState({
        livery_id: '',
        carName: '',
        carType: '',
        paintFile: null,
        specMapFile: null,
    });
    const [paintFileName, setPaintFileName] = useState('');
    const [specMapFileName, setSpecMapFileName] = useState('');

    useEffect(() => {
        // Reset form when modal becomes visible
        if (visible) {
            setFormValues({
                livery_id: '', carName: '', carType: '', paintFile: null, specMapFile: null,
            });
            setPaintFileName('');
            setSpecMapFileName('');
        }
    }, [visible]);

    // --- Improved Styles ---
    const titleStyle = {
        color: '#f56565', // red-500
        marginBottom: '25px',
        textAlign: 'center',
        fontSize: '24px',
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px', // Increased padding
        marginBottom: '20px',
        borderRadius: '6px', // Slightly more rounded
        border: '1px solid #4a5568', // gray-700
        fontSize: '16px',
        backgroundColor: '#1a202c', // gray-900
        color: '#e2e8f0', // slate-200
        boxSizing: 'border-box', // Include padding in width
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    };

    const inputFocusStyle = { // Simulate focus (can't use pseudo-classes inline)
        outline: 'none',
        borderColor: '#f56565', // red-500
        boxShadow: '0 0 0 2px rgba(245, 101, 101, 0.3)', // Red glow
    };

    // --- Custom File Input Styling ---
    const fileInputWrapperStyle = {
        position: 'relative',
        marginBottom: '20px',
    };

    const hiddenFileInputStyle = {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
    };

    const fileInputLabelStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 15px',
        borderRadius: '6px',
        border: '1px dashed #4a5568', // Dashed border for dropzone feel
        fontSize: '16px',
        backgroundColor: '#1a202c',
        color: '#a0aec0', // gray-500
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
    };

    const fileInputLabelHoverStyle = { // Simulate hover
        borderColor: '#718096', // gray-600
        backgroundColor: '#252f41', // Slightly lighter than gray-900
    };

    const fileNameStyle = {
        color: '#e2e8f0', // slate-200
        fontSize: '14px',
        marginLeft: '10px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '200px', // Adjust as needed
    };

    // --- Button Styles ---
    const buttonGroupStyle = {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px', // Space between buttons
        marginTop: '20px',
    };

    const baseButtonStyle = {
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px', // Adjusted padding
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500', // Medium weight
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px', // Space between icon and text
        transition: 'background-color 0.2s ease, transform 0.1s ease',
    };

    const primaryButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: '#f56565', // red-500
    };
    const primaryButtonHoverStyle = { // Simulate hover
        backgroundColor: '#e53e3e', // red-600
    };
    const primaryButtonActiveStyle = { // Simulate active/click
        transform: 'scale(0.98)',
    };

    const secondaryButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: '#718096', // gray-500
    };
    const secondaryButtonHoverStyle = { // Simulate hover
        backgroundColor: '#4a5568', // gray-600
    };
    const secondaryButtonActiveStyle = { // Simulate active/click
        transform: 'scale(0.98)',
    };


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setFormValues((prev) => ({ ...prev, [name]: file }));
            if (name === 'paintFile') setPaintFileName(file ? file.name : '');
            if (name === 'specMapFile') setSpecMapFileName(file ? file.name : '');
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic check if files are selected
        if (!formValues.paintFile || !formValues.specMapFile) {
            alert("Please select both paint and spec map files."); // Replace with better feedback later
            return;
        }
        onSubmit(formValues);
    };

    // State for simulating hover/focus for inline styles
    const [paintFileHover, setPaintFileHover] = useState(false);
    const [specMapFileHover, setSpecMapFileHover] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [activeButton, setActiveButton] = useState(null);

    return (
        <ModalWrapper visible={visible} onClose={onCancel}>
            <h2 style={titleStyle}>Upload New Livery</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="livery_id"
                    placeholder="Livery ID (e.g., team_car_01)"
                    required
                    style={{ ...inputStyle, ...(focusedInput === 'livery_id' && inputFocusStyle) }}
                    value={formValues.livery_id}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('livery_id')}
                    onBlur={() => setFocusedInput(null)}
                />
                <input
                    type="text"
                    name="carName"
                    placeholder="Car Name (e.g., Porsche 911 GT3 R)"
                    required
                    style={{ ...inputStyle, ...(focusedInput === 'carName' && inputFocusStyle) }}
                    value={formValues.carName}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('carName')}
                    onBlur={() => setFocusedInput(null)}
                />
                <input
                    type="text"
                    name="carType"
                    placeholder="Car Type (e.g., GT3)"
                    required
                    style={{ ...inputStyle, ...(focusedInput === 'carType' && inputFocusStyle) }}
                    value={formValues.carType}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('carType')}
                    onBlur={() => setFocusedInput(null)}
                />

                {/* Styled Paint File Input */}
                <div style={fileInputWrapperStyle}>
                    <label
                        htmlFor="paintFile"
                        style={{ ...fileInputLabelStyle, ...(paintFileHover && fileInputLabelHoverStyle) }}
                        onMouseEnter={() => setPaintFileHover(true)}
                        onMouseLeave={() => setPaintFileHover(false)}
                    >
                        <span>{paintFileName ? 'Paint File:' : 'Choose Paint File (.tga, .png, etc.)'}</span>
                        {paintFileName && <span style={fileNameStyle}>{paintFileName}</span>}
                        {!paintFileName && <FaUpload />}
                    </label>
                    <input
                        type="file"
                        id="paintFile"
                        name="paintFile"
                        accept=".tga,image/*" // Be more specific if needed
                        required
                        style={hiddenFileInputStyle}
                        onChange={handleChange}
                    />
                </div>

                {/* Styled Spec Map File Input */}
                <div style={fileInputWrapperStyle}>
                    <label
                        htmlFor="specMapFile"
                        style={{ ...fileInputLabelStyle, ...(specMapFileHover && fileInputLabelHoverStyle) }}
                        onMouseEnter={() => setSpecMapFileHover(true)}
                        onMouseLeave={() => setSpecMapFileHover(false)}
                    >
                        <span>{specMapFileName ? 'Spec Map File:' : 'Choose Spec Map File (.tga, .mip)'}</span>
                        {specMapFileName && <span style={fileNameStyle}>{specMapFileName}</span>}
                        {!specMapFileName && <FaUpload />}
                    </label>
                    <input
                        type="file"
                        id="specMapFile"
                        name="specMapFile"
                        accept=".tga,.mip,image/*" // Be more specific if needed
                        required
                        style={hiddenFileInputStyle}
                        onChange={handleChange}
                    />
                </div>

                <div style={buttonGroupStyle}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            ...secondaryButtonStyle,
                            ...(activeButton === 'cancel' && secondaryButtonActiveStyle)
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = secondaryButtonHoverStyle.backgroundColor}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = secondaryButtonStyle.backgroundColor}
                        onMouseDown={() => setActiveButton('cancel')}
                        onMouseUp={() => setActiveButton(null)}
                        onMouseOut={() => setActiveButton(null)} // In case mouse leaves while pressed
                    >
                        <FaTimes /> Cancel
                    </button>
                    <button
                        type="submit"
                        style={{
                            ...primaryButtonStyle,
                            ...(activeButton === 'upload' && primaryButtonActiveStyle)
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryButtonHoverStyle.backgroundColor}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryButtonStyle.backgroundColor}
                        onMouseDown={() => setActiveButton('upload')}
                        onMouseUp={() => setActiveButton(null)}
                        onMouseOut={() => setActiveButton(null)}
                    >
                        <FaUpload /> Upload
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};

const EditModal = ({ visible, data, onSave, onCancel }) => {
    const [newName, setNewName] = useState('');
    const [focusedInput, setFocusedInput] = useState(false);
    const [activeButton, setActiveButton] = useState(null);

    useEffect(() => {
        if (data) {
            setNewName(data.carName);
        } else {
            setNewName(''); // Reset if data is cleared
        }
    }, [data]);

    if (!data) return null; // Don't render if no data

    const handleSave = () => {
        if (newName.trim()) { // Basic validation
            onSave(newName);
        } else {
            // Add user feedback - maybe shake the input or show a small message
            console.warn("Car name cannot be empty");
        }
    };

    // --- Reusing Styles from UploadModal where applicable ---
    const titleStyle = { color: '#f56565', marginBottom: '20px', fontSize: '22px' };
    const inputStyle = { /* ... copy from UploadModal ... */
        width: '100%', padding: '12px 15px', marginBottom: '25px', borderRadius: '6px',
        border: '1px solid #4a5568', fontSize: '16px', backgroundColor: '#1a202c',
        color: '#e2e8f0', boxSizing: 'border-box', transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    };
    const inputFocusStyle = { /* ... copy from UploadModal ... */
        outline: 'none', borderColor: '#f56565', boxShadow: '0 0 0 2px rgba(245, 101, 101, 0.3)',
    };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#a0aec0', fontSize: '14px', fontWeight: '500' };
    const buttonGroupStyle = { /* ... copy from UploadModal ... */
        display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px',
    };
    const baseButtonStyle = { /* ... copy from UploadModal ... */
        border: 'none', borderRadius: '6px', padding: '10px 20px', color: '#fff', cursor: 'pointer',
        fontSize: '16px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
    };
    const primaryButtonStyle = { /* ... copy from UploadModal ... */
        ...baseButtonStyle, backgroundColor: '#f56565',
    };
    const primaryButtonHoverStyle = { backgroundColor: '#e53e3e' };
    const primaryButtonActiveStyle = { transform: 'scale(0.98)' };
    const secondaryButtonStyle = { /* ... copy from UploadModal ... */
        ...baseButtonStyle, backgroundColor: '#718096',
    };
    const secondaryButtonHoverStyle = { backgroundColor: '#4a5568' };
    const secondaryButtonActiveStyle = { transform: 'scale(0.98)' };

    return (
        <ModalWrapper visible={visible} onClose={onCancel}>
            <h2 style={titleStyle}>Edit Livery Name</h2>
            <label htmlFor="editCarName" style={labelStyle}>Car Name:</label>
            <input
                id="editCarName"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ ...inputStyle, ...(focusedInput && inputFocusStyle) }}
                onFocus={() => setFocusedInput(true)}
                onBlur={() => setFocusedInput(false)}
                required
            />
            <div style={buttonGroupStyle}>
                <button
                    onClick={onCancel}
                    style={{
                        ...secondaryButtonStyle,
                        ...(activeButton === 'cancel' && secondaryButtonActiveStyle)
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = secondaryButtonHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = secondaryButtonStyle.backgroundColor}
                    onMouseDown={() => setActiveButton('cancel')}
                    onMouseUp={() => setActiveButton(null)}
                    onMouseOut={() => setActiveButton(null)}
                >
                    <FaTimes /> Cancel
                </button>
                <button
                    onClick={handleSave}
                    style={{
                        ...primaryButtonStyle,
                        ...(activeButton === 'save' && primaryButtonActiveStyle)
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryButtonHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryButtonStyle.backgroundColor}
                    onMouseDown={() => setActiveButton('save')}
                    onMouseUp={() => setActiveButton(null)}
                    onMouseOut={() => setActiveButton(null)}
                >
                    <FaSave /> Save
                </button>
            </div>
        </ModalWrapper>
    );
};


const ConfirmModal = ({ visible, message, onConfirm, onCancel }) => {
    const [activeButton, setActiveButton] = useState(null);
    // --- Reusing Styles ---
    const titleStyle = { color: '#f56565', marginBottom: '15px', fontSize: '22px' };
    const messageStyle = { marginBottom: '30px', color: '#e2e8f0', lineHeight: '1.6' };
    const buttonGroupStyle = { /* ... copy from UploadModal ... */
        display: 'flex', justifyContent: 'flex-end', gap: '15px',
    };
    const baseButtonStyle = { /* ... copy from UploadModal ... */
        border: 'none', borderRadius: '6px', padding: '10px 20px', color: '#fff', cursor: 'pointer',
        fontSize: '16px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
    };
    const dangerButtonStyle = { // Specific style for confirm delete
        ...baseButtonStyle,
        backgroundColor: '#f56565', // red-500
    };
    const dangerButtonHoverStyle = { backgroundColor: '#e53e3e' }; // red-600
    const dangerButtonActiveStyle = { transform: 'scale(0.98)' };
    const secondaryButtonStyle = { /* ... copy from UploadModal ... */
        ...baseButtonStyle, backgroundColor: '#718096',
    };
    const secondaryButtonHoverStyle = { backgroundColor: '#4a5568' };
    const secondaryButtonActiveStyle = { transform: 'scale(0.98)' };


    return (
        <ModalWrapper visible={visible} onClose={onCancel}>
            <h2 style={titleStyle}>Confirm Action</h2>
            <p style={messageStyle}>{message}</p>
            <div style={buttonGroupStyle}>
                <button
                    onClick={onCancel}
                    style={{
                        ...secondaryButtonStyle,
                        ...(activeButton === 'no' && secondaryButtonActiveStyle)
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = secondaryButtonHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = secondaryButtonStyle.backgroundColor}
                    onMouseDown={() => setActiveButton('no')}
                    onMouseUp={() => setActiveButton(null)}
                    onMouseOut={() => setActiveButton(null)}
                >
                    <FaTimes /> No
                </button>
                <button
                    onClick={onConfirm}
                    style={{
                        ...dangerButtonStyle, // Use danger style for confirmation
                        ...(activeButton === 'yes' && dangerButtonActiveStyle)
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = dangerButtonHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = dangerButtonStyle.backgroundColor}
                    onMouseDown={() => setActiveButton('yes')}
                    onMouseUp={() => setActiveButton(null)}
                    onMouseOut={() => setActiveButton(null)}
                >
                    <FaTrashAlt /> Yes
                </button>
            </div>
        </ModalWrapper>
    );
};


// --- Main Component (Revamped) ---
const IRacingLiveryHub = () => {
    const [userRoles, setUserRoles] = useState([]);
    const [liveries, setLiveries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('carName');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modals/Notifications State
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editModalData, setEditModalData] = useState(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);

    const allowedRoles = ["Developer", "Admin", "Moderator", "Livery Artist", "iRacing Driver"];

    // --- Styles ---
    // ... (Keep all the style constants: containerStyle, controlsContainerStyle, etc.) ...
    const containerStyle = {
        backgroundColor: "#1a202c", // bg-gray-900
        color: "#e2e8f0", // slate-200 (lighter default text)
        minHeight: "100vh",
        padding: "30px", // Increased padding
        paddingTop: "100px", // More space for potential fixed navbar + controls
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Modern font stack
        position: "relative",
    };

    // Control bar styling
    const controlsContainerStyle = {
        display: "flex",
        flexWrap: 'wrap', // Allow wrapping on smaller screens
        gap: '15px', // Space between control items
        alignItems: "center",
        marginBottom: "30px", // Space above table
        padding: '20px',
        backgroundColor: '#2d3748', // bg-gray-800
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    const searchInputStyle = {
        padding: '10px 15px',
        borderRadius: '6px',
        border: '1px solid #4a5568', // gray-700
        fontSize: '16px',
        backgroundColor: '#1a202c', // gray-900
        color: '#e2e8f0',
        minWidth: '250px', // Give search some minimum space
        flexGrow: 1, // Allow it to grow
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    };
    const searchInputFocusStyle = {
        outline: 'none',
        borderColor: '#f56565',
        boxShadow: '0 0 0 2px rgba(245, 101, 101, 0.3)',
    };

    const selectStyle = {
        padding: '10px 15px',
        borderRadius: '6px',
        border: '1px solid #4a5568',
        fontSize: '16px',
        backgroundColor: '#1a202c',
        color: '#e2e8f0',
        cursor: 'pointer',
        minWidth: '150px',
    };

    // Button styles (using base from modals)
    const baseButtonStyle = { /* ... copy from UploadModal ... */
        border: 'none', borderRadius: '6px', padding: '10px 15px', color: '#fff', cursor: 'pointer',
        fontSize: '16px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
    };
    const sortButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: '#718096', // gray-500
        minWidth: '130px', // Ensure text fits
        justifyContent: 'center',
    };
    const sortButtonHoverStyle = { backgroundColor: '#4a5568' }; // gray-700
    const sortButtonActiveStyle = { transform: 'scale(0.98)' };

    const actionButtonStyle = { // For table actions
        ...baseButtonStyle,
        padding: '6px 12px', // Smaller buttons in table
        fontSize: '14px',
        marginRight: '8px', // Space between action buttons
        backgroundColor: '#4a5568', // gray-700 default
    };
    const actionButtonHoverStyle = { backgroundColor: '#718096' }; // gray-500
    const actionButtonActiveStyle = { transform: 'scale(0.98)' };

    const downloadButtonStyle = { ...actionButtonStyle, backgroundColor: '#38a169' }; // green-600
    const downloadButtonHoverStyle = { backgroundColor: '#2f855a' }; // green-700

    const editButtonStyle = { ...actionButtonStyle, backgroundColor: '#dd6b20' }; // orange-600
    const editButtonHoverStyle = { backgroundColor: '#c05621' }; // orange-700

    const deleteButtonStyle = { ...actionButtonStyle, backgroundColor: '#f56565' }; // red-500
    const deleteButtonHoverStyle = { backgroundColor: '#e53e3e' }; // red-600

    // --- Table Styling ---
    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse", // Changed to collapse for cleaner lines
        marginTop: "20px",
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px', // Apply radius to container if needed, or style first/last cells
        overflow: 'hidden', // Needed for border-radius on table
    };

    const tableHeaderStyle = {
        backgroundColor: "#2d3748", // bg-gray-800
        borderBottom: "2px solid #4a5568", // Heavier bottom border for header
        padding: "15px", // Increased padding
        color: "#f56565", // red-500 accent
        textAlign: "left", // Align text left for readability
        fontSize: "16px",
        fontWeight: '600', // Bolder headers
        textTransform: 'uppercase', // Uppercase headers
        letterSpacing: '0.5px',
    };
    const tableHeaderActionsStyle = { ...tableHeaderStyle, textAlign: "center", width: '200px' }; // Center align actions header, give fixed width

    const tableCellStyle = {
        backgroundColor: "#1f2738", // Slightly different row color if needed (mix gray-800/900)
        borderBottom: "1px solid #4a5568", // Lighter border between rows
        padding: "15px",
        color: "#cbd5e0", // slate-300 (slightly brighter cell text)
        fontSize: "15px",
        textAlign: "left", // Align text left
        verticalAlign: 'middle', // Ensure vertical alignment
    };
    const tableCellActionsStyle = { ...tableCellStyle, textAlign: "center" }; // Center align action buttons

    const tableRowHoverStyle = { // Cannot apply pseudo-class inline, just defining for reference
        backgroundColor: "#2d3748", // bg-gray-800 on hover
    };

    const loadingOverlayStyle = {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(26, 32, 44, 0.8)', // bg-gray-900 with opacity
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 500, // Below modals
        color: '#f56565',
        fontSize: '20px',
        fontWeight: 'bold',
    };

    const emptyStateStyle = {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px',
        color: '#a0aec0', // gray-500
        backgroundColor: '#2d3748', // bg-gray-800
        borderRadius: '8px',
        marginTop: '30px',
    };

    // --- Floating Action Button (FAB) ---
    const fabStyle = {
        position: "fixed",
        bottom: "30px",
        right: "30px",
        backgroundColor: "#f56565", // red-500
        border: "none",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        color: "#fff",
        fontSize: "28px", // Larger icon size
        cursor: "pointer",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 900, // Below modals but above content
        transition: 'background-color 0.2s ease, transform 0.2s ease',
    };
    const fabHoverStyle = { backgroundColor: '#e53e3e' }; // red-600
    const fabActiveStyle = { transform: 'scale(0.95)' };

    // --- Role Handling ---
    const parseRoles = (rolesString) => { /* ... unchanged ... */
        if (!rolesString) return [];
        let cleaned = rolesString.replace(/[{}"]/g, '');
        return cleaned.split(',').map((role) => role.trim()).filter((role) => role.length > 0);
    };
    const fetchUserRoles = useCallback(async () => { /* ... unchanged ... */
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return ['iRacing Driver'];
        const parsedUser = JSON.parse(storedUser);
        try {
            const response = await fetch(`https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/profile?email=${parsedUser.email}`);
            if (!response.ok) throw new Error('Failed to fetch user profile');
            const data = await response.json();
            if (data.roles) return parseRoles(data.roles);
            if (data.role) return [data.role];
            return ['iRacing Driver'];
        } catch (err) {
            console.error('Error fetching user role:', err);
            setError('Could not fetch user roles.'); // Set error state
            return ['iRacing Driver']; // Default on error
        }
    }, []);

    // --- Notification Handler ---
    const showNotification = useCallback((message, type = "success") => {
        setNotification({ message, type, visible: true });
        setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 4000);
    }, []); // Added useCallback dependency array

    // --- Data Fetching (Reverted Transformation to handle {S: ...}) ---
    const fetchLiveries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/internal/iracing_team/liveries");
            if (!response.ok) {
                let errorMsg = `Failed to fetch liveries (Status: ${response.status})`;
                try {
                    const errData = await response.json();
                    errorMsg = errData.message || errData.error || errorMsg;
                } catch (e) {/* Ignore parsing error */}
                throw new Error(errorMsg);
            }
            const data = await response.json(); // Assuming this still returns [{ livery_id: {S: "..."}, ...}]

            // **** REVERTED CHANGE HERE ****
            // Revert transformation to handle the {S: ...} format, as the error indicates it's still present
            const transformedData = data.map(item => ({
                // Use optional chaining (?.) and nullish coalescing (||) for safety
                livery_id: item.livery_id?.S || item.livery_id || `missing_id_${Math.random()}`,
                carName: item.carName?.S || item.carName || "Unknown Car",
                carType: item.carType?.S || item.carType || "Unknown Type",
                carGroup: item.carGroup?.S || item.carGroup || "N/A",
                // Add any other fields returned by the Scan projection if needed later
                paintFileName: item.paintFileName?.S || item.paintFileName,
                specMapFileName: item.specMapFileName?.S || item.specMapFileName,
            }));
            setLiveries(transformedData);

        } catch (err) {
            console.error("Error fetching liveries:", err);
            const errorText = err.message || "An error occurred while fetching liveries.";
            setError(errorText);
            setLiveries([]);
            showNotification("Error fetching liveries: " + errorText, "error");
        } finally {
            setLoading(false);
        }
    }, [showNotification]); // Keep dependency [showNotification]); // Now showNotification is memoized with useCallback


    useEffect(() => {
        const initialize = async () => {
            const roles = await fetchUserRoles();
            setUserRoles(roles);
            if (roles.length > 0 && roles.some(role => allowedRoles.includes(role))) {
                fetchLiveries();
            } else if (roles.length > 0) {
                setLoading(false);
            }
        };
        initialize();
    }, [fetchUserRoles, fetchLiveries]); // Keep dependencies

    // --- Sorting and Filtering ---
    const sortLiveries = (a, b) => { /* ... unchanged ... */
        const fieldA = String(a[sortField] || "").toLowerCase();
        const fieldB = String(b[sortField] || "").toLowerCase();
        const comparison = fieldA.localeCompare(fieldB); // Use localeCompare for better string sorting
        return sortOrder === "asc" ? comparison : -comparison;
    };
    const displayedLiveries = liveries
        .filter(livery => /* ... unchanged ... */
            String(livery.carName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(livery.carType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(livery.livery_id || "").toLowerCase().includes(searchTerm.toLowerCase()) // Search multiple fields
        )
        .sort(sortLiveries);


    // --- Action Handlers (Updated Download URL) ---

    const handleDownload = (liveryId) => {
        // **** CHANGE HERE ****
        // Update the query parameter from 'id' to 'livery_id'
        console.log(`Initiating download for livery_id: ${liveryId}`);
        window.location.href = `https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/internal/iracing_team/liveries/download?livery_id=${liveryId}`;
    };

    const handleUpload = async (uploadValues) => { /* ... unchanged ... */
        // This function already prepares the correct payload with base64 data
        const { livery_id, carName, carType, paintFile, specMapFile } = uploadValues;
        showNotification("Uploading livery...", "info");
        try {
            const paintFileData = await toBase64(paintFile);
            const specMapFileData = await toBase64(specMapFile);
            const payload = {
                livery_id, carName, carType,
                paintFileName: paintFile.name, specMapFileName: specMapFile.name,
                paintFileData, specMapFileData,
                // carGroup: 'Default', // Decide if you need to send carGroup explicitly
            };

            const res = await fetch("https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/internal/iracing_team/liveries/upload", {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
            });
            // Improved error handling to get message from response body
            if (!res.ok) {
                let errorMsg = `Upload failed with status ${res.status}`;
                try {
                    const errData = await res.json();
                    errorMsg = errData.message || errData.error || errorMsg;
                } catch(e) {/* Ignore parsing error */}
                throw new Error(errorMsg);
            }
            const result = await res.json(); // Get success message

            showNotification(result.message || "Livery uploaded successfully!", "success");
            setUploadModalVisible(false);
            fetchLiveries(); // Refresh list

        } catch (error) {
            console.error("Upload error:", error);
            showNotification(`Error uploading livery: ${error.message}`, "error");
        }
    };

    const handleEdit = (livery) => { /* ... unchanged ... */
        setEditModalData(livery);
        setEditModalVisible(true);
    };

    const confirmEditSave = async (newCarName) => { /* ... unchanged (only edits name for now) ... */
        if (!editModalData) return;
        showNotification("Saving changes...", "info");
        // Currently only sending name update, which is fine with the new backend
        const payload = { livery_id: editModalData.livery_id, carName: newCarName };
        try {
            const res = await fetch("https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/internal/iracing_team/liveries/edit", {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
            });
            if (!res.ok) {
                let errorMsg = `Edit failed with status ${res.status}`;
                try {
                    const errData = await res.json();
                    errorMsg = errData.message || errData.error || errorMsg;
                } catch(e) {/* Ignore parsing error */}
                throw new Error(errorMsg);
            }
            const result = await res.json();

            showNotification(result.message || "Livery updated successfully!", "success");
            setEditModalVisible(false);
            // Update state directly
            setLiveries(prevLiveries =>
                prevLiveries.map(l =>
                    l.livery_id === editModalData.livery_id ? { ...l, carName: newCarName } : l
                )
            );
            setEditModalData(null);

        } catch (error) {
            console.error("Edit error:", error);
            showNotification(`Error updating livery: ${error.message}`, "error");
        }
    };

    const handleDelete = (liveryId) => { /* ... unchanged ... */
        setDeleteTargetId(liveryId);
        setConfirmModalVisible(true);
    };

    const confirmDelete = async () => { /* ... unchanged ... */
        // Sends { livery_id: ... } which matches the backend
        if (!deleteTargetId) return;
        showNotification("Deleting livery...", "info");
        try {
            const res = await fetch("https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/internal/iracing_team/liveries/delete", {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ livery_id: deleteTargetId }),
            });
            if (!res.ok) {
                let errorMsg = `Delete failed with status ${res.status}`;
                try {
                    const errData = await res.json();
                    errorMsg = errData.message || errData.error || errorMsg;
                } catch(e) {/* Ignore parsing error */}
                throw new Error(errorMsg);
            }
            const result = await res.json();

            showNotification(result.message || "Livery deleted successfully.", "success");
            setConfirmModalVisible(false);
            // Remove from state
            setLiveries(prevLiveries => prevLiveries.filter(l => l.livery_id !== deleteTargetId));
            setDeleteTargetId(null);

        } catch (error) {
            console.error("Delete error:", error);
            showNotification(`Error deleting livery: ${error.message}`, "error");
            setConfirmModalVisible(false);
            setDeleteTargetId(null);
        }
    };

    // Toggle sort order & icon logic
    const handleSort = (field) => { /* ... unchanged ... */
        const newOrder = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
    };
    const getSortIcon = (field) => { /* ... unchanged ... */
        if (sortField !== field) return <FaSort color="#a0aec0" />; // Default icon (gray-500)
        if (sortOrder === 'asc') return <FaSortUp />; // Active sort ascending
        return <FaSortDown />; // Active sort descending
    };


    // --- Render Logic ---
    const [searchInputFocused, setSearchInputFocused] = useState(false);
    const [activeSortButton, setActiveSortButton] = useState(false);
    const [activeFab, setActiveFab] = useState(false);
    const [hoveredRowId, setHoveredRowId] = useState(null);
    const [activeActionButtons, setActiveActionButtons] = useState({});

    // Access Denied Check
    if (!loading && userRoles.length > 0 && !userRoles.some(role => allowedRoles.includes(role))) {
        /* ... unchanged ... */
        return (
            <div style={containerStyle}>
                <h1 style={{ color: "#f56565", textAlign: 'center', marginTop: '50px' }}>Access Denied</h1>
                <p style={{ textAlign: 'center', color: '#a0aec0' }}>You do not have the required permissions to view this page.</p>
            </div>
        );
    }

    // Main Content Render
    return (
        <div style={containerStyle}>
            {/* Notification */}
            {notification.visible && ( /* ... unchanged ... */
                <GlobalNotification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
                />
            )}

            {/* Page Title */}
            <h1 style={{ color: "#f56565", marginBottom: '30px', borderBottom: '1px solid #4a5568', paddingBottom: '15px' }}>
                iRacing Livery Dashboard
            </h1>


            {/* Controls Bar */}
            <div style={controlsContainerStyle}>
                {/* ... Search, Sort Select, Sort Button ... unchanged ... */}
                <input
                    type="text"
                    placeholder="Search by ID, Name, Type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ ...searchInputStyle, ...(searchInputFocused && searchInputFocusStyle) }}
                    onFocus={() => setSearchInputFocused(true)}
                    onBlur={() => setSearchInputFocused(false)}
                />
                <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)} // Change sort field immediately
                    style={selectStyle}
                    aria-label="Sort by field"
                >
                    <option value="carName">Sort by: Car Name</option>
                    <option value="carType">Sort by: Car Type</option>
                    <option value="carGroup">Sort by: Car Group</option>
                    <option value="livery_id">Sort by: Livery ID</option>
                </select>
                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} // Toggle order
                    style={{
                        ...sortButtonStyle,
                        ...(activeSortButton && sortButtonActiveStyle)
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = sortButtonHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = sortButtonStyle.backgroundColor}
                    onMouseDown={() => setActiveSortButton(true)}
                    onMouseUp={() => setActiveSortButton(false)}
                    onMouseOut={() => setActiveSortButton(false)}
                    aria-label={`Sort order ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
                >
                    {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
                    {sortOrder === "asc" ? "Asc" : "Desc"}
                </button>
            </div>

            {/* Loading Overlay */}
            {loading && ( /* ... unchanged ... */
                <div style={loadingOverlayStyle}>Loading Liveries...</div>
            )}

            {/* Error State */}
            {!loading && error && ( /* ... unchanged ... */
                <div style={emptyStateStyle}>
                    <p style={{color: '#f56565', fontWeight: 'bold'}}>Error!</p>
                    <p>{error}</p>
                    <button
                        onClick={fetchLiveries}
                        style={{...sortButtonStyle, marginTop: '20px', backgroundColor: '#f56565'}} // Reuse style, change color
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e53e3e'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f56565'}
                    >Retry Fetch</button>
                </div>
            )}

            {/* Table */}
            {!loading && !error && displayedLiveries.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        {/* Table Head */}
                        <thead>
                        <tr>
                            {/* Table Headers (unchanged, still sortable) */}
                            {/* ... th elements for livery_id, carName, carType, carGroup, Actions ... */}
                            <th style={tableHeaderStyle} onClick={() => handleSort('livery_id')} role="columnheader" aria-sort={sortField === 'livery_id' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Livery ID {getSortIcon('livery_id')}
                                </span>
                            </th>
                            <th style={tableHeaderStyle} onClick={() => handleSort('carName')} role="columnheader" aria-sort={sortField === 'carName' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Car Name {getSortIcon('carName')}
                                 </span>
                            </th>
                            <th style={tableHeaderStyle} onClick={() => handleSort('carType')} role="columnheader" aria-sort={sortField === 'carType' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                 <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Car Type {getSortIcon('carType')}
                                 </span>
                            </th>
                            <th style={tableHeaderStyle} onClick={() => handleSort('carGroup')} role="columnheader" aria-sort={sortField === 'carGroup' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Car Group {getSortIcon('carGroup')}
                                </span>
                            </th>
                            <th style={tableHeaderActionsStyle} role="columnheader">Actions</th>
                        </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                        {displayedLiveries.map((livery) => {
                            // ... unchanged row rendering logic ...
                            const rowId = livery.livery_id;
                            const isHovered = hoveredRowId === rowId;
                            const rowStyle = {
                                ...tableCellStyle,
                                ...(isHovered && tableRowHoverStyle),
                                transition: 'background-color 0.15s ease-in-out',
                            };
                            return (
                                <tr key={rowId} onMouseEnter={() => setHoveredRowId(rowId)} onMouseLeave={() => setHoveredRowId(null)}>
                                    <td style={rowStyle}>{livery.livery_id}</td>
                                    <td style={rowStyle}>{livery.carName}</td>
                                    <td style={rowStyle}>{livery.carType}</td>
                                    <td style={rowStyle}>{livery.carGroup || "N/A"}</td>
                                    <td style={{ ...rowStyle, ...tableCellActionsStyle }}>
                                        {/* Download Button (onClick uses handleDownload which is updated) */}
                                        <button onClick={() => handleDownload(rowId)} style={{...downloadButtonStyle, /* ... */}} title="Download Livery">
                                            <FaDownload />
                                        </button>
                                        {/* Edit/Delete Buttons (unchanged logic) */}
                                        {(userRoles.includes("Livery Artist") || userRoles.includes("Admin") || userRoles.includes("Developer")) && (
                                            <>
                                                <button onClick={() => handleEdit(livery)} style={{...editButtonStyle, /* ... */}} title="Edit Livery Name">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(rowId)} style={{...deleteButtonStyle, /* ... */}} title="Delete Livery">
                                                    <FaTrashAlt />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && displayedLiveries.length === 0 && ( /* ... unchanged ... */
                <div style={emptyStateStyle}>
                    <p>{liveries.length === 0 ? "No liveries found in the database." : "No liveries match your search criteria."}</p>
                </div>
            )}

            {/* FAB */}
            {(userRoles.includes("Livery Artist") || userRoles.includes("Admin") || userRoles.includes("Developer")) && ( /* ... unchanged ... */
                <button onClick={() => setUploadModalVisible(true)} style={{...fabStyle, /* ... */}} title="Upload New Livery">
                    <FaPlus />
                </button>
            )}

            {/* Modals */}
            {/* ... UploadModal, EditModal, ConfirmModal rendering (unchanged) ... */}
            <UploadModal
                visible={uploadModalVisible}
                onSubmit={handleUpload}
                onCancel={() => setUploadModalVisible(false)}
            />
            <EditModal
                visible={editModalVisible}
                data={editModalData}
                onSave={confirmEditSave}
                onCancel={() => { setEditModalVisible(false); setEditModalData(null); }} // Clear data on cancel too
            />
            <ConfirmModal
                visible={confirmModalVisible}
                message={`Are you sure you want to delete the livery with ID: ${deleteTargetId}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => { setConfirmModalVisible(false); setDeleteTargetId(null); }} // Clear target ID on cancel
            />
        </div>
    );
};

export default IRacingLiveryHub;