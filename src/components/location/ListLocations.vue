<template>
    <div class="content" id="list-locations-container">
        <div class="columns is-multiline">
            <ListItem 
                v-for="(location, index) in loadLocations"
                v-bind:item = "location"
                v-bind:index="index"
                v-bind:key="location.id"
                v-bind:selected="selected"
                v-bind:columnSize="columnSize"
                v-bind:imageFolder="'locations'"
                v-on:setListItem="setLocation(location)"
            > </ListItem>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
export default {
    name: "ListLocations",
    props:
        ['scrollTarget', 
        'selected', 
        'sort', 
        'sortDirection',
        'columnSize'],
    components: {
        ListItem: () => import('@/components/ui/list/ListItem.vue'),
    },
    computed: {
        loadLocations(){
            let sortDirection = this.sortDirection;
            let locations = this.$store.state.locations;
            if (this.sort === 'name'){
                return _.orderBy(locations, [location => location.name.toLowerCase()], sortDirection);
            }
            else if (this.sort === 'createdDate'){
                return _.orderBy(locations, 'createdAt', sortDirection);
            }
            else{
                 return _.orderBy(locations, [location => location.name.toLowerCase()], sortDirection);
            }
        }
    },
    methods: {
        async setLocation(location){
            this.$store.dispatch('setLocation', location)
            this.listOptions = false
            this.$nextTick(() => {
                this.scrollTarget.scrollIntoView({behavior: "smooth"});
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    #list-locations-container{
        margin-top:5px;
    }
    .card-hover:hover {
        opacity: 0.7;
        cursor: pointer;
    }
    #options{
        min-height: 40px;
    }

</style>
 