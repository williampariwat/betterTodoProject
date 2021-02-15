<template>
  <div class = "pt-3">
    <v-row class="d-flex justify-center">
      <v-col cols="6">
        <v-text-field
          label="List"
          outlined v-model="newTodo"
          @keyup.enter="addTodo">
        </v-text-field>
      </v-col>
      <v-col cols="1">
        <v-btn large color="primary" @click="addTodo">Add</v-btn>
      </v-col>
    </v-row>
    <transition-group name="fade">
      <v-card
        class="mx-auto pa-3 ma-2 text-center"
        max-width="500"
        v-for="todo in todosFiltered" v-bind:key="todo.id">

        <v-layout>
          <v-checkbox
                      v-model="todo.completed" @change="doneEdit"
          >
          </v-checkbox>
          <v-list-item-title >
            {{todo.title}}
          </v-list-item-title>
          <v-menu
            class="justify-end"
            :close-on-content-click="false"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              >
                Subtask
              </v-btn>
            </template>
            <v-list class="justify-end">
              <v-text-field
                label="Add your task"
                outlined
                v-model="subTodo"
                 >
              </v-text-field>
              <v-list-item
                v-for="(item, index) in subtask"
                :key="index"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="todo.date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="todo.date"
                label="Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="todo.date"
              no-title
              scrollable
            >
<!--              <v-spacer></v-spacer>-->
<!--              <v-btn-->
<!--                text-->
<!--                color="primary"-->
<!--                @click="menu = false"-->
<!--              >-->
<!--                Cancel-->
<!--              </v-btn>-->
<!--              <v-btn-->
<!--                text-->
<!--                color="primary"-->
<!--                @click="$refs.menu.save(date)"-->
<!--              >-->
<!--                OK-->
<!--              </v-btn>-->
            </v-date-picker>
          </v-menu>
          <v-btn icon color="red" @click="removeTodo(todo.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
        </v-layout>

      </v-card>
    </transition-group>
    <v-divider></v-divider>
    <v-row align="center">
      <v-col >
        <v-layout>
<!--          <v-checkbox label="Check All" :checked="!anyRemaining"-->
<!--          @change="checkAllTodos"></v-checkbox>-->
          <v-card-text class="text-right"> {{remaining}} items left</v-card-text>
<!--          <p class="text-right"> {{remaining}} items left </p>-->
        </v-layout>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn :color="filter === 'all' ? 'green':'grey' "
             @click="changeFilter('all')">All</v-btn>
      <v-btn :color="filter === 'active' ? 'green':'grey' "
               @click="changeFilter('active')"
        >Active</v-btn>
      <v-btn :color="filter === 'completed' ? 'green':'grey' "
               @click="changeFilter('completed')">Completed</v-btn>
      <v-btn :disabled="!showClearCompletedButton"
             @click="clearCompleted" width="200">Clear Completed</v-btn>
    </v-card-actions>

    <v-divider></v-divider>

    <v-col>
    <v-btn @click="logout">Logout</v-btn>
    </v-col>
  </div>
</template>

<script>
// import { db } from '@/firebase/db';
import firebase from 'firebase';

export default {
  components: { },
  data() {
    return {
      id: this.todo.id,
      title: this.todo.title,
      completed: this.todo.completed,
      timestamp: this.todo.timestamp,
      editing: this.todo.editing,
      beforeEditCache: '',
      newTodo: '',
      idForTodo: 3,
      subtask: [],
      date: new Date(),
    };
  },
  props: {
    // todo: {
    //   type: Object,
    //   required: true,
    // },
  },
  watch: {
    todo() {
      this.title = this.todo.title;
      this.completed = this.todo.completed;
    },
  },
  created() {
    this.$store.dispatch('initRealtimeListeners');
    this.$store.dispatch('retrieveTodos');
  },
  methods: {
    // checkAllTodos() {
    //   // eslint-disable-next-line no-param-reassign,no-return-assign,no-restricted-globals
    //   this.Todos.forEach((todo) => todo.completed = event.target.checked);
    // },
    doneEdit() {
      this.$store.dispatch('updateTodo', {
        id: this.id,
        title: this.title,
        completed: this.completed,
        timestamp: this.timestamp,
        editing: this.editing,
      });
    },
    cancelEdit() {
      this.title = this.beforeEditCache;
      this.editing = false;
    },
    addTodo() {
      if (this.newTodo.trim().length === 0) {
        return;
      }
      this.$store.dispatch('addTodo', {
        id: this.idForTodo,
        title: this.newTodo,
      });
      this.newTodo = '';
      // eslint-disable-next-line no-plusplus
      this.idForTodo++;
    },
    // subTodo() {
    //   if (this.newTodo.trim().length === 0) {
    //     return;
    //   }
    //   this.$store.dispatch('addTodo', {
    //     id: this.idForTodo,
    //     title: this.newTodo,
    //   });
    //   this.newTodo = '';
    //   // eslint-disable-next-line no-plusplus
    //   this.idForTodo++;
    // },
    removeTodo(id) {
      this.$store.dispatch('deleteTodo', id);
    },

    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login');
      });
    },
    clearCompleted() {
      this.$store.dispatch('clearCompleted');
    },
    changeFilter(filter) {
      this.$store.dispatch('updateFilter', filter);
    },
  },
  computed: {
    submittableDateTime() {
      const date = new Date(this.todo.date);
      return date;
    },
    filter() {
      return this.$store.state.filter;
    },
    remaining() {
      // eslint-disable-next-line vue/no-async-in-computed-properties
      return this.$store.getters.remaining;
    },
    // anyRemaining() {
    //   return this.remaining !== 0;
    // },
    showClearCompletedButton() {
      return this.$store.getters.showClearCompletedButton;
    },
    todosFiltered() {
      return this.$store.getters.todosFiltered;
    },
  },
  // firestore: {
  //   ToDos: db.collection('ToDos'),
  // },
};
</script>

<style>
.active {
  background: lightgreen;
}
.completed{
  text-decoration: line-through;
  color: grey;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
