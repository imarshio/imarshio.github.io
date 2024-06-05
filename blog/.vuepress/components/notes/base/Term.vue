<template>
    <div>
        <h2>我的表哥</h2>
        <p>姓名: {{ cousin.name }}</p>
        <p>年龄: {{ cousin.age }}</p>
        <p>职业: {{ cousin.occupation }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cousin: {
                name: '张三',
                age: 30,
                occupation: '工程师'
            }
        };
    }
};
</script>