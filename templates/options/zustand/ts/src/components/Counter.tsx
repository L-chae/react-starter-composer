import { useCounterStore } from '../stores/useCounterStore'

function Counter() {
  const count = useCounterStore((state) => state.count)
  const increase = useCounterStore((state) => state.increase)

  return (
    <button type="button" onClick={increase}>
      Count: {count}
    </button>
  )
}

export default Counter
