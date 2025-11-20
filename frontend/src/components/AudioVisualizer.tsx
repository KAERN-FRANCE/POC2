interface AudioVisualizerProps {
  audioLevel: number
  isRecording: boolean
}

const AudioVisualizer = ({ audioLevel, isRecording }: AudioVisualizerProps) => {
  const bars = Array.from({ length: 20 }, (_, i) => {
    const height = Math.max(
      10,
      isRecording ? audioLevel * 100 * (0.5 + Math.random() * 0.5) : 10
    )
    return height
  })

  return (
    <div className="flex items-center justify-center space-x-1 h-24">
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-2 rounded-full transition-all duration-100 ${
            isRecording ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          style={{
            height: `${height}%`,
          }}
        />
      ))}
    </div>
  )
}

export default AudioVisualizer
