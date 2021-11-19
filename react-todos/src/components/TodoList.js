import React, { useEffect, useState, useCallback } from "react";
import { Tabs, Layout, Row, Col, message } from "antd";

import "./TodoList.css";
import TodoTab from "./TodoTab";
import TodoForm from "./TodoForm";
import {
  createTodo,
  deleteTodo,
  loadTodos,
  updateTodo,
} from "../services/todoService";

const { TabPane } = Tabs;
const { Content } = Layout;

const TodoList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [todos, setTodos] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  const refresh = () => {
    loadTodos()
      .then((json) => {
        setTodos(json);
        setActiveTodos(json.filter((todo) => todo.completed === false));
        setCompletedTodos(json.filter((todo) => todo.completed === true));
      })
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    let data = await loadTodos();
    setTodos(data);
    setActiveTodos(data.filter((todo) => todo.completed === false));
    setCompletedTodos(data.filter((todo) => todo.completed === true));
    setRefreshing(false);
  }, [refreshing]);

  useEffect(() => {
    refresh();
  }, [onRefresh]);

  const handleFormSubmit = async (todo) => {
    await createTodo(todo).then(onRefresh());
    message.success("Task added!");
  };

  const handleRemoveTodo =  async (todo) => {
    await deleteTodo(todo.id).then(onRefresh());
    message.warn("Task removed!");
  };

  const handleToggleTodoStatus = async (todo) => {
    todo.completed = !todo.completed;
    await updateTodo(todo).then(onRefresh());
    message.info("Task status updated!");
  };

  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px" }}>
        <div className="todolist">
          <Row>
            <Col span={14} offset={5}>
              <h1>Tasks</h1>
              <TodoForm onFormSubmit={handleFormSubmit} />
              <br />
              <Tabs defaultActiveKey="all">
                <TabPane tab="All" key="all">
                  <TodoTab
                    todos={todos}
                    onTodoToggle={handleToggleTodoStatus}
                    onTodoRemoval={handleRemoveTodo}
                  />
                </TabPane>
                <TabPane tab="Active" key="active">
                  <TodoTab
                    todos={activeTodos}
                    onTodoToggle={handleToggleTodoStatus}
                    onTodoRemoval={handleRemoveTodo}
                  />
                </TabPane>
                <TabPane tab="Complete" key="complete">
                  <TodoTab
                    todos={completedTodos}
                    onTodoToggle={handleToggleTodoStatus}
                    onTodoRemoval={handleRemoveTodo}
                  />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default TodoList;
