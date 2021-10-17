
import { useState, useEffect} from 'react';
import shortid from 'shortid';
import ContactForm from './components/ContactForm/ContactForm';
import ContactList from './components/ContactList/ContactList'
import Filter from './components/Filter/Filter';
import s from'./App.module.css';

const App = () => {
  // значение "по умолчанию" для контактов
  const initial = [
    { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
    { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
    { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
    { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
  ];
  // задаем useState для contacts и Filter
  // для State contact - "ленивая инициализация". Начальное значение либо берется из localStorage,
  // либо из initial, при этосм проверка осуществляется только при первом рендере
  const [contacts, setContacts] = useState(() =>
    JSON.parse(window.localStorage.getItem('phonebookContacts')) ?? initial);
  const [filter, setFilter] = useState('');
// функция добавления контактов, полученных из ContactForm
  const formSubmitHandler = newRecord => {
    const normalizedNewName = newRecord.name.toLowerCase();
    const isUnique = !contacts.some(({ name }) =>
      name.toLowerCase() === normalizedNewName);
    if (!isUnique) {
      alert('THIS NAME IS ALREADY PRESENT IN A PHONEBOOK');
      return
    }
      newRecord.id = shortid.generate();
    return setContacts([...contacts, newRecord]);
  }
  // Запись обновленного массива контактов в localStorage
  useEffect (()=>{
    window.localStorage.setItem('phonebookContacts', JSON.stringify(contacts));
    },[contacts]
  )

// установка значения фильтра ()
  const updateFilter = (e) => {
    setFilter (e.currentTarget.value);
  };
  // фильтруем имеющиеся контакты на основании значения фильтра, после чего будет отрендерен отфильтрованный перечень
  const getFilteredContacts = () => {
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
  contact.name.toLowerCase().includes(normalizedFilter));
  }

  const deleteContact = toDeleteId => {
    setContacts(contacts.filter(contact => contact.id !== toDeleteId));
  }
  
    return (
      <div className={s.container}>
        <h1 className={s.headline}>Phone book</h1>
        <ContactForm onSubmit={formSubmitHandler} />
        <h2 className={s.headline}>Contacts</h2>
        <Filter value={filter} onFilter={updateFilter} />
        <ContactList
          visibleList={getFilteredContacts()}
          onDelete={deleteContact}
        />
      </div>
    );

}
export default App;
