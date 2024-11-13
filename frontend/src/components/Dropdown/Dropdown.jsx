import { useState } from 'react'
import styles from './Dropdown.module.css'

const Dropdown = ({ label, options = [], onSelect, selectedOption }) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        onSelect && onSelect(option);
        setIsOpen(false);
    };
    return (
        <div className={styles.container}>
            <button
                onClick={toggleDropdown}
                className={styles.dropdown_btn}
            >
                {selectedOption || label}
            </button>
            {isOpen && (
                <div className={styles.dropdown} >
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(option)}
                            className={styles.content}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dropdown