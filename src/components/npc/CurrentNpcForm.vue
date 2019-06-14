<template>
        <div v-if="loadNpc">
            <div class="columns">
                <div>
                   <p class="update-message">{{updateMessage}}</p>
                    <a v-if="!isEditing" @click="edit">Edit</a>
                    <div v-if="isEditing">
                        <a @click="isEditing = false">Quit Editing</a>
                        
                        <p v-if="errors.length">
                            <i><font-awesome-icon icon="exclamation-triangle" /></i><b>Please correct the following error(s):</b>
                            <ul>
                                <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
                            </ul>
                        </p>
                        <form @submit.prevent="updateNpc" enctype="multipart/form-data">
                            <div class="field">
                                <label class="label" for="name">Name:</label>
                                <div class="control">
                                    <input type="input" class="input" name="name" placeholder="NPC Name" v-model="loadNpc.name">
                                </div>
                            </div>
                            <div class="field">
                                <label for="race" class="label">Race:</label>
                                <div class="control">
                                    <input type="input" class="input" name="race" placeholder="NPC Race" v-model="loadNpc.race">
                                </div>
                            </div>
                            <div class="field">
                                <label for="description" class="label" >Description:</label>
                                <textarea  class="textarea"  name="description" placeholder="Physical Description" v-model="loadNpc.description"></textarea>
                            </div>
                            <div class="field">
                                <label for="lifestate" class="label">Life State:</label>
                                <div class="control">
                                    <input type="input" class="input" name="lifeState" placeholder="Dead or alive? Somewhere in between?" v-model="loadNpc.lifeState">
                                </div>
                            </div>
                            <div class="field">
                                <label for="sharedBio" class="label" >Shared Biography:</label>
                                <textarea  class="textarea"  name="sharedBio" placeholder="All players and GMs will see this." v-model="loadNpc.sharedBio"></textarea>
                            </div>
                            <div class="field">
                                <label for="privateBio" class="label" >Private Biography:</label>
                                <textarea  class="textarea"  name="privateBio" placeholder="Biography that will only be shared between the GM and the player." v-model="loadNpc.privateBio"></textarea>
                            </div>
                            <div class="field">
                                <label for="image" class="image" >Image:</label>
                                <input type="file" class="file"  ref="file" @change="selectFile">
                            </div>

                            <div class="field is-grouped">
                                <p class="control">
                                    <input type="submit" class="button is-primary" value="Update">
                                </p>
                                <p class="control">
                                    <!-- <input type="button" class="button" value="Discard Changes" @click="hideNpc"> -->
                                </p>
                                <p class="control">
                                    <input type="button" class="button is-warning" value="Delete" @click="deleteNpc">
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: "CurrentNpc",
    computed: {
        ...mapGetters([
            'getNpcById',
            'getNpcId'
        ]),
        loadNpc(){
            const id = this.$store.getters.getNpcId;
            return this.$store.getters.getNpcById(id);
        }
    },
    data() {
        return {
            file: null,
            isEditing: false,
            deleteAlert: false,
            updateMessage: '',
            errors: [],
            error: '',
            defaultThumbnail: "src='./assets/logo.png'",
            showChangeImageButton: false,
            newImage: false,
            
        }
    },
    methods:{
        selectFile(){
            this.file = this.$refs.file.files[0];
            this.newImage = true;
            const file = this.$refs.file.files[0];
            this.url = URL.createObjectURL(file);
        },
        edit(){
            if (!this.isEditing){
                this.isEditing = true;
            }
            else{
                this.isEditing = false;
            }
        },
        async updateNpc(){ 
            if (!this.loadNpc.name){
                this.errors.push('Name is required.');
            }else{
               if (this.newImage === true){
                    const formData = new FormData();

                    if (this.file){
                        const npcId = this.loadNpc.id;
                        const oldImage = this.loadNpc.imageSrc;

                        formData.append('NpcId', npcId);
                        formData.append('oldImage', oldImage);
                        formData.append('file', this.file);
                        formData.append("name", this.loadNpc.name);
                        formData.append("race", this.loadNpc.race);
                        formData.append("profession", this.loadNpc.profession);
                        formData.append("description", this.loadNpc.lifeState);
                        formData.append("sharedBio", this.loadNpc.sharedBio);
                        formData.append("privateBio", this.loadNpc.privateBio);
                        try{
                            this.$store.dispatch('updateNpcWithImage', formData)
                            .then(
                                this.isEditing = false,
                                this.updateMessage = '',
                                this.newImage = false,
                               
                                (error) => this.error = error.response.data.error

                            )
                        }catch(err){
                            this.updateMessage = "Error updating Image."
                            console.log(err);
                        }
                    }else{
                        this.updateMessage = "No change to image."
                    }
               }
               else{
                    this.$store.dispatch('updateNpc', this.loadNpc)
                    .then(
                        this.isEditing = false,
                        this.updateMessage = "Updated.",
                        setTimeout(() => this.updateMessage = null, 3000),
                        (error) => this.error = error.response.data.error
                    )
               }
            }
        },
        async deleteNpc(){ 

           if  (confirm('Delete PC?')) {
            this.$store.dispatch('deleteNpc', this.loadNpc)
                .then(
                    this.isEditing = false,
                    this.updateMessage = '',
                    this.$store.dispatch('setNpcNull', null),  
                    (error) => this.error = error.response.data.error
                )
           }
           else{
            this.updateMessage = "Delete cancelled."
            setTimeout(() => this.updateMessage = null, 3000);
           }
        }
    }
}

</script>

<style lang="scss">

// #currentImage{
//     max-width:200px;
// }

</style>