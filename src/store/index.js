import Vue from 'vue';
import Vuex from 'vuex';
// eslint-disable-next-line import/no-named-as-default
import db from '@/firebase/db';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: true,
    filter: 'all',
    todos: [],
    subtask: [],
    globalDate: null,
  },
  getters: {
    remaining(state) {
      return state.todos.filter((todo) => !todo.completed).length;
    },
    anyRemaining(state, getters) {
      // eslint-disable-next-line eqeqeq
      return getters.remaining != 0;
    },
    todosFiltered(state) {
      if (state.filter === 'all') {
        return state.todos;
      } if (state.filter === 'active') {
        return state.todos.filter((todo) => !todo.completed);
      } if (state.filter === 'completed') {
        return state.todos.filter((todo) => todo.completed);
      }
      return state.todos;
    },
    todoSubtask(state) {
      return state.subtask;
    },
    showClearCompletedButton(state) {
      return state.todos.filter((todo) => todo.completed).length > 0;
    },
  },
  mutations: {
    addTodo(state, todo) {
      state.todos.push({
        id: todo.id,
        title: todo.title,
        completed: false,
        timestamp: new Date(),
        editing: false,
      });
    },
    updateTodo(state, todo) {
      const index = state.todos.findIndex((item) => item.id === todo.id);
      state.todos.splice(index, 1, {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        editing: todo.editing,
      });
    },
    deleteTodo(state, id) {
      const index = state.todos.findIndex((item) => item.id === id);

      if (index >= 0) {
        state.todos.splice(index, 1);
      }
    },
    checkAll(state, checked) {
      // eslint-disable-next-line no-param-reassign,no-return-assign
      state.todos.forEach((todo) => (todo.completed = checked));
    },
    updateFilter(state, filter) {
      state.filter = filter;
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((todo) => !todo.completed);
      console.log(state.todos);
    },
    retrieveTodos(state, todos) {
      state.todos = todos;
    },
    updateLoading(state, loading) {
      state.loading = loading;
    },
  },
  actions: {
    initRealtimeListeners(context) {
      db.collection('todos').onSnapshot((snapshot) => {
        snapshot.docChanges.forEach((change) => {
          if (change.type === 'added') {
            const source = change.doc.metadata.hasPendingWrites ? 'Local' : 'Server';

            if (source === 'Server') {
              context.commit('addTodo', {
                id: change.doc.id,
                title: change.doc.data().title,
                completed: false,
              });
            }
          }
          if (change.type === 'modified') {
            context.commit('updateTodo', {
              id: change.doc.id,
              title: change.doc.data().title,
              completed: change.doc.data().completed,
            });
          }
          if (change.type === 'removed') {
            context.commit('deleteTodo', change.doc.id);
          }
        });
      });
    },
    retrieveTodos(context) {
      context.commit('updateLoading', true);
      db.collection('todos').get()
        .then((querySnapshot) => {
          const tempTodos = [];
          querySnapshot.forEach((doc) => {
            const data = {
              id: doc.id,
              title: doc.data().title,
              completed: doc.data().completed,
              timestamp: doc.data().timestamp,
            };
            tempTodos.push(data);
          });

          context.commit('updateLoading', false);
          // eslint-disable-next-line max-len
          const tempTodosSorted = tempTodos.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);

          context.commit('retrieveTodos', tempTodosSorted);
        });
    },
    addTodo(context, todo) {
      db.collection('todos').add({
        title: todo.title,
        completed: false,
        timestamp: new Date(),
      })
        .then((docRef) => {
          context.commit('addTodo', {
            id: docRef.id,
            title: todo.title,
            completed: false,
          });
        });
    },
    updateTodo(context, todo) {
      db.collection('todos').doc(todo.id).set({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        timestamp: todo.timestamp,
      }, { merge: true })
        .then(() => {
          context.commit('updateTodo', todo);
        });
    },
    deleteTodo(context, id) {
      db.collection('todos').doc(id).delete()
        .then(() => {
          context.commit('deleteTodo', id);
        });
    },
    checkAll(context, checked) {
      db.collection('todos').get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.update({
              completed: checked,
            })
              .then(() => {
                context.commit('checkAll', checked);
              });
          });
        });
    },
    updateFilter(context, filter) {
      context.commit('updateFilter', filter);
    },
    clearCompleted(context) {
      db.collection('todos').where('completed', '==', true).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete()
              .then(() => {
                context.commit('clearCompleted');
              });
          });
        });
    },
  },
});
