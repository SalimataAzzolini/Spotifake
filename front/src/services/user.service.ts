import axios from "axios";
import { LoginResponse, UserData } from "./user.service.type";

class UserService {
    apiUrl = "http://localhost:3000";
    
    async login(email: string, password: string): Promise<LoginResponse> {
        const res = await axios.post(this.apiUrl + "/api/users/login", {
            email,
            password
        });
        return res.data;
    }

    async register(userData: Partial<UserData>): Promise<boolean>{
        return new Promise((resolve, reject) => {
            
            const newUser = {
                ...new UserData(),
                ...userData
            };

            axios.post(this.apiUrl + "/api/users/register", newUser)
                .then(() => {
                    resolve(true);
                })
                .catch(() => {
                    console.log("Erreur dans la requete");
                    reject(false);
                });
        });
    }

    async validateAccount(token: string): Promise<void> {
        await axios.post(this.apiUrl + "/api/users/validate",{
            token
        });
    }

    async getProfileInfo(auth: string | null): Promise<Partial<UserData>> {
        return new Promise((resolve, reject) => 
            axios.get(this.apiUrl + "/api/users/profile",{
                headers:{
                    Authorization: `bearer ${auth}`
                }
            })
                .then(res => resolve(res.data))
                .catch(err => reject(err))
        );
    }

    async updateProfileInfo(auth: string | null, newProfileInfo: Partial<UserData>): Promise<object> {
        return new Promise((resolve, reject) => 
            axios.put(this.apiUrl + "/api/users/update-account",newProfileInfo,{
                headers:{
                    Authorization: `bearer ${auth}`
                },
            })
                .then(() => resolve({}))
                .catch((error) => {
                    if(error.response.status === 304)
                        reject({message: "Aucune modification effectuée",color: "orange"});

                    reject({message:"Une erreur est survenue.", color: "red"});
                })
        );
    }

    async deleteAccount(auth: string | null): Promise<boolean>{
        return new Promise((resolve, reject) => {
            axios.delete(this.apiUrl + "/api/users/delete-account",{
                headers:{
                    Authorization: `bearer ${auth}`
                },
            })
                .then(() => resolve(true))
                .catch(() => reject(false));
        });
    }

    async checkAuthentication(): Promise<boolean>{
        
        return new Promise((resolve, reject) => {
            const auth = sessionStorage.getItem("auth");
            axios.get(this.apiUrl +"/api/users/check-authentication",{
                headers:{
                    Authorization: `bearer ${auth}`
                }
            })
                .then(() => resolve(true))
                .catch(() => reject(false));
        });
        
    }
}

const userServiceInstance = new UserService();

export default userServiceInstance;
