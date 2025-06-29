import { useEffect, useState } from "react";

import userService from "../services/userService";

import Pagination from "./Pagination";
import Search from "./Search";
import UserListItem from "./UserListItem";
import UserCreate from "./UserCreate";
import UserInfo from "./UserInfo";
import UserDelete from "./UserDelete";
import { toast } from 'react-toastify'

export default function UserList() {
    const [showCreate, setShowCreate] = useState(false);
    const [userIdInfo, setUserIdInfo] = useState(null);
    const [userIdDelete, setUserIdDelete] = useState(null);
    const [userIdEdit, setUserIdEdit] = useState(null);
    const [failedToFetch, setFailedToFetch] = useState(false);
    const [curUsers, setCurrentUsers] = useState([]);
    const [baseUsers, setBaseUsers] = useState(curUsers);

    
    useEffect(() => {
        
        userService.getAll()
        .then(result => {
            setCurrentUsers(result);
            setBaseUsers(result);
        })
            .catch((err) => {
                toast.error(err.message);
                setFailedToFetch(true);
                
            })
            
        }, []);
        
        
        const onUsersCountPaginationChange = (curUsers) => {
            setCurrentUsers(curUsers);
            setBaseUsers(curUsers);
        };

    const createUserClickHandler = () => {
        setShowCreate(true);
    }

    const closeCreateUserClickHandler = () => {
        setShowCreate(false);
        setUserIdEdit(null);
    }

    const saveCreateUserClickHandler = async (e) => {
        //prevent default refresh
        e.preventDefault();

        //get form data
        const form = new FormData(e.target.parentElement.parentElement);
        const formData = Object.fromEntries(form);

        //post req on server
        const newUser = await userService.create(formData);

        //update state
        setCurrentUsers(prevUsers => [...prevUsers, newUser]);
        setBaseUsers(prevUsers => [...prevUsers, newUser]);

        //close modal
        setShowCreate(false);
    }

    const userInfoClickHandler = async (userId) => {
        setUserIdInfo(userId);
    }

    const closeUserInfoClickHandler = () => {
        setUserIdInfo(null);
    }

    const userDeleteClickHandler = (userId) => {
        setUserIdDelete(userId);
    }
 
    const closeUserDeleteClickHandler = () => {
        setUserIdDelete(null);
    }
    
    const userDeleteHandler = async (userId) => {
        //delete user
        const delUser = await userService.delete(userId);
        
        //delete from local state
        setCurrentUsers(state => state.filter(user => user._id !== delUser._id));
        setBaseUsers(state => state.filter(user => user._id !== delUser._id));

        //close modal
        setUserIdDelete(null);
    }

    const userEditClickHandler = (userId) => {
        setUserIdEdit(userId);
    }

    const saveEditUserClickHandler = async (e) => {
        const userId = userIdEdit;
        //stop default submit refresh
        e.preventDefault();

        //get form data
        const form = new FormData(e.target.parentElement.parentElement);
        const formData = Object.fromEntries(form);

        //Update user on server
        const updatedUser = await userService.update(userId, formData);

        //update local state
        setCurrentUsers(state => state.map(user => user._id === userId ? updatedUser : user));
        setBaseUsers(state => state.map(user => user._id === userId ? updatedUser : user));

        //close modal
        setUserIdEdit(null);
    }

    const handleSearch = (searchText, criteria) => {
        if(!searchText || !criteria) {
            return curUsers
        }

       const searchUsers = curUsers.filter((user) => user[criteria]?.toLowerCase().includes(searchText.toLowerCase()))
        
       setCurrentUsers(searchUsers);
        
    }

    const handleClear = () => {
        return setCurrentUsers(baseUsers);
    }

    const handleSortByCriteria = (criteria) => {
        switch (criteria) {
            case 'firstName':
                setCurrentUsers(prevUsers => [...prevUsers].sort((a, b) => a.firstName.localeCompare(b.firstName)));
                break;

            case 'lastName':
                setCurrentUsers(prevUsers => [...prevUsers].sort((a, b) => a.lastName.localeCompare(b.lastName)));
                break;

            case 'email':
                setCurrentUsers(prevUsers => [...prevUsers].sort((a, b) => a.email.localeCompare(b.email)));
                break;

            case 'phoneNumber':
                setCurrentUsers(prevUsers => [...prevUsers].sort((a, b) => a.phoneNumber - b.phoneNumber));
                break;

            case 'createdAt':
                setCurrentUsers(prevUsers => [...prevUsers].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
                break;
            default:
                break;
        }        
    }

    return (
        <section className="card users-container">

            <Search
                onSearch={handleSearch} 
                onClear={handleClear}
            />

            {showCreate && (
                    <UserCreate 
                        onClose={closeCreateUserClickHandler}
                        onSave={saveCreateUserClickHandler}
                    />
                    )}

            {userIdInfo && (
                    <UserInfo
                         onClose={closeUserInfoClickHandler}
                         userId={userIdInfo}
                    />
                    )}

            {userIdDelete && (
                <UserDelete
                    onDelete={userDeleteHandler}
                    onClose={closeUserDeleteClickHandler}
                    userId={userIdDelete}
                 />)
                 }

            {userIdEdit && (
                    <UserCreate 
                        userId={userIdEdit}
                        onClose={closeCreateUserClickHandler}
                        onSave={saveCreateUserClickHandler}
                        onEdit={saveEditUserClickHandler}
                    />
            )}

			<div className="table-wrapper">
                <div className="overlays">

				{/* <!-- <div className="loading-shade"> --> */}

				{/* <!-- On error overlap component  --> */}

				
				{/* <!-- </div> --> */}
                </div>

				<table className="table">
				<thead>
					<tr>
					<th>
						Image
					</th>
					<th onClick={() => handleSortByCriteria('firstName')}>
						First name<svg aria-hidden="true" focusable="false" data-prefix="fas"
						data-icon="arrow-down" className="icon svg-inline--fa fa-arrow-down Table_icon__+HHgn" role="img"
						xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
						<path fill="currentColor"
							d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z">
						</path>
						</svg>
					</th>
					<th onClick={() => handleSortByCriteria('lastName')}>
						Last name<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down"
						className="icon svg-inline--fa fa-arrow-down Table_icon__+HHgn" role="img" xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 384 512">
						<path fill="currentColor"
							d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z">
						</path>
						</svg>
					</th>
					<th onClick={() => handleSortByCriteria('email')}>
						Email<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down"
						className="icon svg-inline--fa fa-arrow-down Table_icon__+HHgn" role="img" xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 384 512">
						<path fill="currentColor"
							d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z">
						</path>
						</svg>
					</th>
					<th onClick={() => handleSortByCriteria('phoneNumber')}>
						Phone<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down"
						className="icon svg-inline--fa fa-arrow-down Table_icon__+HHgn" role="img" xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 384 512">
						<path fill="currentColor"
							d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z">
						</path>
						</svg>
					</th>
					<th onClick={() => handleSortByCriteria('createdAt')}>
						Created
						<svg aria-hidden="true" focusable="false" data-prefix="fas"
						data-icon="arrow-down" className="icon active-icon svg-inline--fa fa-arrow-down Table_icon__+HHgn" role="img"
						xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
						<path fill="currentColor"
							d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z">
						</path>
						</svg>
					</th>
					<th>Actions</th>
					</tr>
				</thead>
				<tbody>

                    {failedToFetch ? (
                         <div className="table-overlap">
                         <svg
                         aria-hidden="true"
                         focusable="false"
                         data-prefix="fas"
                         data-icon="triangle-exclamation"
                         className="svg-inline--fa fa-triangle-exclamation Table_icon__+HHgn"
                         role="img"
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 512 512"
                         >
                         <path
                         fill="currentColor"
                         d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"
                         ></path>
                         </svg>
                         <h2>Failed to fetch</h2>
                         </div>
                    ) : (

                        curUsers.length > 0 ? (
                            curUsers.length !== 0 ? (

                                curUsers ? (
                                    curUsers.map(user => <UserListItem
                                    key={user._id}
                                    _id={user._id}
                                    onInfoClick={userInfoClickHandler}
                                    onDeleteClick={userDeleteClickHandler}
                                    onEditClick={userEditClickHandler}
                                    {...user}
                                    />)
                                ) :   <div className="table-overlap">
                                <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="triangle-exclamation"
                            className="svg-inline--fa fa-triangle-exclamation Table_icon__+HHgn"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            >
                            <path
                            fill="currentColor"
                            d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"
                            ></path>
                            </svg>
                            <h2>There is no users yet.</h2>
                            </div>
                        ) : (
                            <tr>
                            <td>
                            
                            <div className="table-overlap">
                            <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="triangle-exclamation"
                            className="svg-inline--fa fa-triangle-exclamation Table_icon__+HHgn"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            >
                            <path
                            fill="currentColor"
                            d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"
                            />
                            </svg>
                            <h2>Sorry, we couldn&apos;t find what you&apos;re looking for.</h2>
                            </div>
                            </td>
                            </tr>
                        )
                    ) : (
                        <tr>
                        <td>
                        <div className="spinner"></div>
                        </td>
                        </tr>
                    )
                         
                )}
                        </tbody>
				</table>
			</div>

			{/* <!-- New user button  --> */}
			<button className="btn-add btn" onClick={createUserClickHandler}>Add new user</button>

			{/* <!-- Pagination component  --> */}
			<Pagination
                users={curUsers}
                onPagChange={onUsersCountPaginationChange}
            />
			</section>
    );
}

