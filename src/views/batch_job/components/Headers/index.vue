<template>
  <div>
    <div v-for="(item, index) in headers" :key="index">
      <el-row :gutter="24" align="middle">
        <el-col :span="10">
          <el-input
            v-model="item.k"
            placeholder="请输入Header键名"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="10">
          <el-input
            v-model="item.v"
            placeholder="请输入Header值"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            @click="removeHeader(index)"
            :icon="iconMinus"
            v-if="!readonly"
          />
        </el-col>
      </el-row>
    </div>

    <el-button @click="addHeader" :icon="iconPlus" v-if="!readonly" />
  </div>
</template>

<script setup>
import iconPlus from "~icons/ep/plus";
import iconMinus from "~icons/ep/minus";

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false
  }
});

const headers = defineModel();

// 添加新的Header项
const addHeader = () => {
  headers.value.push({ k: "", v: "" });
};

// 删除指定索引的Header项
const removeHeader = index => {
  headers.value.splice(index, 1);
};
</script>
