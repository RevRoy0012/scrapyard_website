import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Global_page_transition_wrapper_component = ({ children }) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black z-10 overflow-y-auto"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default Global_page_transition_wrapper_component;