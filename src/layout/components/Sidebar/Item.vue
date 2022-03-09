<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    // styles: {
    //   type: Object,
    //   default(){
    //     return {}
    //   }
    // }
  },
  render(h, context) {
    const { icon, title, icons, styles } = context.props
    const vnodes = []
    // console.log('context.props',context.props)
    if (!icon.includes('http')) {
      vnodes.push(<svg-icon icon-class={icon} />)
    }
    if (icon.includes('http')) {
      vnodes.push(
        <img src={icon} style="width:24px;height:24px;margin-right:6px;" />
      )
    }

    if (title) {
      vnodes.push(<span slot="title">{title}</span>)
    }
    return vnodes
  },
}
</script>
