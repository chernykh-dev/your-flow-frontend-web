import { useEffect, useState } from "react";
import {Tree, Button, Modal, Form, Input, Space, Checkbox} from "antd";
import {getTodos, addTodo, updateTodo, deleteTodo, toggleTodo} from "../api/todosApi";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function TodoTree() {
    const [treeData, setTreeData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingNode, setEditingNode] = useState(null);
    const [parentId, setParentId] = useState(null);

    const fetchData = async () => {
        const { data } = await getTodos();
        setTreeData(buildTree(data));
    }

    /*
    const sortByCompleted = (a, b) => {
        if (a.isCompleted && !b.isCompleted)
            return -1;
        if (!a.isCompleted && b.isCompleted)
            return 1;

        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
    }
    */

    const buildTree = (items) => {
        const map = new Map();
        const roots = [];

        items.forEach(item => {
            map.set(item.id, { ...item, key: item.id, title: item.title, children: [] });
        });

        map.forEach(item => {
            if (item.parentId && map.has(item.parentId)) {
                map.get(item.parentId).children.push(item);
            } else {
                roots.push(item);
            }
        });

        const sortTree = (nodes) => {
            return nodes
                .map(x => ({ ...x, children: sortTree(x.children || []) }));
                // .sort(sortByCompleted);
        }

        return sortTree(roots);
    }

    useEffect(() => {
        fetchData();
    }, []);


    const onFinish = async (values) => {
        if (editingNode) {
            await updateTodo(editingNode.id, {
                ...editingNode,
                title: values.title,
                description: values.description
            });
        } else {
            await addTodo({
                title: values.title,
                description: values.description,
                parentId: parentId
            });
        }

        form.resetFields();
        setModalVisible(false);
        setEditingNode(null);
        setParentId(null);
        fetchData();
    };

    const onAdd = (node) => {
        setParentId(node.id);
        setModalVisible(true);
    };

    const onEdit = (node) => {
        setEditingNode(node);
        form.setFieldsValue({
            title: node.title,
            description: node.description,
        });
        setModalVisible(true);
    };

    const onCheckToggle = async (node) => {
        await toggleTodo(node.id, !node.isCompleted);
        fetchData();
    }

    const onDelete = async (node) => {
        await deleteTodo(node.id);
        fetchData();
    };

    const handleDrop = async (info) => {
        const dragId = info.dragNode.key;
        const dropId = info.node.key;
        const dropToGap = info.dropToGap;
        const dropPos = info.node.pos.split("-").map(Number);
        const dropPosition = info.dropPosition - dropPos[dropPos.length - 1];

        const flatList = flattenTree(treeData);

        const dragItem = flatList.find(item => item.id === dragId);
        const dropItem = flatList.find(item => item.id === dropId);

        if (!dragItem || !dropItem) return;

        // Определим нового родителя
        let newParentId = null;
        if (!dropToGap) {
            // Вложили внутрь
            newParentId = dropItem.id;
        } else {
            // На том же уровне
            newParentId = dropItem.parentId;
        }

        // Собираем новую структуру — дети нового родителя
        const newSiblings = flatList.filter(
            x => x.parentId === newParentId && x.id !== dragItem.id
        );

        // Найдём индекс для вставки
        const dropIndex = newSiblings.findIndex(x => x.id === dropItem.id);
        const insertIndex = dropToGap
            ? dropPosition < 0 ? dropIndex : dropIndex + 1
            : 0;

        newSiblings.splice(insertIndex, 0, dragItem);

        // Обновим dragItem: parent + order
        for (let i = 0; i < newSiblings.length; i++) {
            const item = newSiblings[i];
            const newOrder = i + 1;

            const update = {
                ...item,
                order: newOrder,
                parentId: newParentId
            };

            await updateTodo(item.id, update);
        }

        fetchData();
    };

    const flattenTree = (nodes, result = []) => {
        nodes.forEach(node => {
            result.push(node);
            if (node.children) {
                flattenTree(node.children, result);
            }
        });
        return result;
    };

    const renderTree = (nodes) =>
        nodes.map(node => ({
            ...node,
            title: (
                <div className="flex flex-wrap items-center gap-2">
                    <Checkbox
                        checked={node.isCompleted}
                        onChange={() => onCheckToggle(node)}
                    />
                    <span
                        className={`${
                            node.isCompleted ? "line-through text-gray-400" : ""
                        } text-sm sm:text-base`}
                    >
                    {node.title}
                    </span>
                    <Button
                        icon={<PlusOutlined/>}
                        size="small"
                        onClick={() => onAdd(node)}
                    />
                    <Button
                        icon={<EditOutlined/>}
                        size="small"
                        onClick={() => onEdit(node)}
                    />
                    <Button
                        icon={<DeleteOutlined/>}
                        size="small"
                        danger
                        onClick={() => onDelete(node)}
                    />
                </div>
                /*
                <Space
                    wrap
                    style={{
                        rowGap: 4,
                        columnGap: 8,
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <Checkbox
                        checked={node.isCompleted}
                        onChange={() => onCheckToggle(node)}
                    />
                    <span style={{
                        textDecoration: node.isCompleted ? "line-through" : "none",
                        flex: 1,
                    }}
                    >
                        {node.title}
                    </span>
                    <Button icon={<PlusOutlined />} size="small" onClick={() => onAdd(node)} />
                    <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(node)} />
                    <Button icon={<DeleteOutlined />} size="small" danger onClick={() => onDelete(node)} />
                </Space>
                 */
            ),
            children: node.children ? renderTree(node.children) : []
        }));

    return (
        <div className="w-full">
            <div className="w-full bg-white p-2 rounded shadow-sm">
                <Tree
                    className="overflow-x-auto"
                    treeData={renderTree(treeData)}
                    defaultExpandAll
                    draggable
                    onDrop={handleDrop}
                />
            </div>

            <div className="mt-4 flex justify-center sm:justify-start">
                <Button
                    type="primary"
                    onClick={() => {
                        setModalVisible(true);
                        setEditingNode(null);
                        form.resetFields();
                    }}
                >
                    Add Root Task
                </Button>
            </div>

            <Modal
                title={editingNode ? "Edit Task" : "Add Task"}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingNode(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="title" label="Title" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
        /*<>
            <div style={{overflowX: "auto", maxWidth: "100%"}}>
                <Tree
                    treeData={renderTree(treeData)}
                    defaultExpandAll
                    draggable
                    onDrop={handleDrop}
                />
            </div>

            <Button
                type="primary"
                onClick={() => {
                    setModalVisible(true);
                    setEditingNode(null);
                    form.resetFields();
                }}
                style={{marginTop: 16, width: "100%"}}
            >
                Add Root Task
            </Button>

            <Modal
                title={editingNode ? "Edit Task" : "Add Task"}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingNode(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </>*/
    );
}