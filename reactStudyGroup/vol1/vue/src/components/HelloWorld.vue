<template>
  <div>
    <h1>Hello World</h1>
    <input :placeholder="placeholder"/>
  </div>
</template>

<script>
export default {
  props:{
    placeholder: {type: String, required:true}
  }
}
</script>>