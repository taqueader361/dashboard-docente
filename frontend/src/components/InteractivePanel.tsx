import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

interface InteractivePanelProps {
  onClose: () => void;
}

const InteractivePanel: React.FC<InteractivePanelProps> = ({ onClose }) => {
  const [activeTool, setActiveTool] = useState<'annotations' | 'screenshot' | 'roulette' | 'poll'>('annotations');
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [students] = useState<string[]>([
    'Ana García', 'Carlos López', 'María Rodríguez', 'Juan Martínez', 'Laura Sánchez',
    'Pedro González', 'Sofia Fernández', 'Diego Pérez', 'Valentina Ruiz', 'Mateo Díaz'
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [spinAngle, setSpinAngle] = useState(0);
  const [currentPoll, setCurrentPoll] = useState<{
    question: string;
    options: string[];
    votes: number[];
    isActive: boolean;
  } | null>(null);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']);
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;
  }, []);

  // Update canvas properties when color or brush size changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return;

    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;

    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;

    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveAnnotation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `anotacion-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const takeScreenshot = async () => {
    try {
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        width: window.innerWidth,
        height: window.innerHeight,
        x: 0,
        y: 0
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `captura-aula-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error al capturar pantalla:', error);
      alert('Error al capturar la pantalla. Inténtalo de nuevo.');
    }
  };

  const spinRoulette = () => {
    if (isSpinning || students.length === 0) return;

    setIsSpinning(true);
    setSelectedStudent(null);

    const spins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const finalAngle = spinAngle + (spins * 360) + randomAngle;

    setSpinAngle(finalAngle);

    setTimeout(() => {
      const normalizedAngle = finalAngle % 360;
      const segmentAngle = 360 / students.length;
      const selectedIndex = Math.floor((360 - normalizedAngle + segmentAngle / 2) / segmentAngle) % students.length;
      setSelectedStudent(students[selectedIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const createPoll = () => {
    if (!newQuestion.trim() || newOptions.filter(opt => opt.trim()).length < 2) {
      alert('Por favor ingresa una pregunta y al menos 2 opciones.');
      return;
    }

    const validOptions = newOptions.filter(opt => opt.trim());
    setCurrentPoll({
      question: newQuestion.trim(),
      options: validOptions,
      votes: new Array(validOptions.length).fill(0),
      isActive: true
    });

    setShowCreatePoll(false);
    setNewQuestion('');
    setNewOptions(['', '']);
  };

  const vote = (optionIndex: number) => {
    if (!currentPoll || !currentPoll.isActive) return;

    const newVotes = [...currentPoll.votes];
    newVotes[optionIndex]++;

    setCurrentPoll({
      ...currentPoll,
      votes: newVotes
    });
  };

  const endPoll = () => {
    if (currentPoll) {
      setCurrentPoll({
        ...currentPoll,
        isActive: false
      });
    }
  };

  const resetPoll = () => {
    setCurrentPoll(null);
    setShowCreatePoll(false);
    setNewQuestion('');
    setNewOptions(['', '']);
  };

  const addOption = () => {
    if (newOptions.length < 6) {
      setNewOptions([...newOptions, '']);
    }
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  const removeOption = (index: number) => {
    if (newOptions.length > 2) {
      setNewOptions(newOptions.filter((_, i) => i !== index));
    }
  };

  const toggleProjectorMode = () => {
    setIsProjectorMode(!isProjectorMode);
    if (!isProjectorMode) {
      // Abrir nueva ventana para modo proyector
      const projectorWindow = window.open(
        '',
        'projector',
        'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
      );

      if (projectorWindow) {
        projectorWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Modo Proyector - Dashboard Docente</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  background: #1f2937;
                  color: white;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                }
                .projector-content {
                  text-align: center;
                  max-width: 800px;
                }
                .title {
                  font-size: 3rem;
                  font-weight: bold;
                  margin-bottom: 2rem;
                  color: #fbbf24;
                }
                .message {
                  font-size: 1.5rem;
                  margin-bottom: 2rem;
                }
                .tool-display {
                  background: rgba(255, 255, 255, 0.1);
                  padding: 2rem;
                  border-radius: 1rem;
                  margin-top: 2rem;
                }
                .close-btn {
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  background: #dc2626;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 1rem;
                }
              </style>
            </head>
            <body>
              <button class="close-btn" onclick="window.close()">Cerrar Proyector</button>
              <div class="projector-content">
                <div class="title">🎯 Panel Interactivo de Aula</div>
                <div class="message">
                  Modo Proyector Activado<br>
                  Los estudiantes pueden ver el contenido en esta pantalla
                </div>
                <div id="tool-display" class="tool-display">
                  <div style="font-size: 2rem;">Selecciona una herramienta para mostrar</div>
                </div>
              </div>
            </body>
          </html>
        `);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">🎯 Panel Interactivo de Aula</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleProjectorMode}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                isProjectorMode
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}
            >
              📺 {isProjectorMode ? 'Modo Proyector ON' : 'Modo Proyector'}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tool Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <button
              onClick={() => setActiveTool('annotations')}
              className={`p-3 rounded-lg border-2 transition-colors text-center ${
                activeTool === 'annotations'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-xl mb-1">✏️</div>
              <div className="text-xs font-medium">Anotaciones</div>
            </button>

            <button
              onClick={() => setActiveTool('screenshot')}
              className={`p-3 rounded-lg border-2 transition-colors text-center ${
                activeTool === 'screenshot'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-xl mb-1">📸</div>
              <div className="text-xs font-medium">Captura</div>
            </button>

            <button
              onClick={() => setActiveTool('roulette')}
              className={`p-3 rounded-lg border-2 transition-colors text-center ${
                activeTool === 'roulette'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-xl mb-1">🎲</div>
              <div className="text-xs font-medium">Ruleta</div>
            </button>

            <button
              onClick={() => setActiveTool('poll')}
              className={`p-3 rounded-lg border-2 transition-colors text-center ${
                activeTool === 'poll'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-xl mb-1">📊</div>
              <div className="text-xs font-medium">Encuestas</div>
            </button>
          </div>

          {/* Tool Content */}
          {activeTool === 'annotations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">✏️ Sistema de Anotaciones</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={clearCanvas}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={saveAnnotation}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>

              {/* Drawing Controls */}
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Color:</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Grosor:</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600 w-6">{brushSize}px</span>
                </div>
              </div>

              {/* Canvas */}
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="cursor-crosshair block"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>

              <p className="text-sm text-gray-600 text-center">
                Haz clic y arrastra para dibujar sobre el canvas. Las anotaciones se pueden guardar como imagen.
              </p>
            </div>
          )}

          {activeTool === 'screenshot' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📸 Captura de Pantalla</h3>
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-gray-600">
                    Captura la pantalla completa con todas las anotaciones y contenido visible
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={takeScreenshot}
                    className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    📸 Capturar Pantalla Completa
                  </button>

                  <div className="text-xs text-gray-500 text-center">
                    La imagen se descargará automáticamente como PNG
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Consejos:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• La captura incluye todo el contenido visible</li>
                    <li>• Se guarda automáticamente en tu carpeta de descargas</li>
                    <li>• Útil para guardar momentos importantes de la clase</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTool === 'roulette' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">🎲 Ruleta de Participación</h3>
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🎲</div>
                  <p className="text-gray-600">
                    Selecciona un estudiante al azar para fomentar la participación
                  </p>
                </div>

                {/* Roulette Wheel */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div
                      className="w-48 h-48 rounded-full border-8 border-purple-500 relative overflow-hidden transition-transform duration-3000 ease-out"
                      style={{
                        transform: `rotate(${spinAngle}deg)`,
                        background: `conic-gradient(${students.map((_, index) =>
                          `${index % 2 === 0 ? '#8B5CF6' : '#A855F7'} ${index * (360 / students.length)}deg ${(index + 1) * (360 / students.length)}deg`
                        ).join(', ')})`
                      }}
                    >
                      {students.map((student, index) => {
                        const angle = (index * 360) / students.length;
                        return (
                          <div
                            key={index}
                            className="absolute w-full h-full flex items-center justify-center text-white text-xs font-medium"
                            style={{
                              transform: `rotate(${angle + 360 / students.length / 2}deg) translateY(-60px)`
                            }}
                          >
                            <span
                              style={{
                                transform: `rotate(${-(angle + 360 / students.length / 2)}deg)`
                              }}
                            >
                              {student.split(' ')[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-3">
                  <button
                    onClick={spinRoulette}
                    disabled={isSpinning}
                    className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition-colors font-medium"
                  >
                    {isSpinning ? 'Girando...' : '🎲 Girar Ruleta'}
                  </button>

                  {selectedStudent && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl mb-2">🎉</div>
                      <p className="text-green-800 font-medium">
                        ¡{selectedStudent} ha sido seleccionado!
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">💡 Consejos:</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• La ruleta gira varias veces para mayor emoción</li>
                    <li>• Incluye a todos los estudiantes de la clase</li>
                    <li>• Fomenta la participación equitativa</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTool === 'poll' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">📊 Encuestas Rápidas</h3>
                {!currentPoll && !showCreatePoll && (
                  <button
                    onClick={() => setShowCreatePoll(true)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Crear Encuesta
                  </button>
                )}
              </div>

              {showCreatePoll && (
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-4">Crear Nueva Encuesta</h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pregunta:</label>
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="¿Cuál es tu color favorito?"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Opciones:</label>
                      <div className="space-y-2">
                        {newOptions.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                              placeholder={`Opción ${index + 1}`}
                              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            {newOptions.length > 2 && (
                              <button
                                onClick={() => removeOption(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {newOptions.length < 6 && (
                        <button
                          onClick={addOption}
                          className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                        >
                          + Agregar Opción
                        </button>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={createPoll}
                        className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Crear Encuesta
                      </button>
                      <button
                        onClick={() => setShowCreatePoll(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentPoll && (
                <div className="space-y-4">
                  <div className="p-6 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-lg mb-4">{currentPoll.question}</h4>

                    <div className="space-y-3">
                      {currentPoll.options.map((option, index) => {
                        const totalVotes = currentPoll.votes.reduce((sum, vote) => sum + vote, 0);
                        const percentage = totalVotes > 0 ? (currentPoll.votes[index] / totalVotes) * 100 : 0;

                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{option}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                  {currentPoll.votes[index]} votos ({percentage.toFixed(1)}%)
                                </span>
                                {currentPoll.isActive && (
                                  <button
                                    onClick={() => vote(index)}
                                    className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                                  >
                                    Votar
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 text-sm text-gray-600 text-center">
                      Total de votos: {currentPoll.votes.reduce((sum, vote) => sum + vote, 0)}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    {currentPoll.isActive ? (
                      <button
                        onClick={endPoll}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Finalizar Encuesta
                      </button>
                    ) : (
                      <button
                        onClick={resetPoll}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Nueva Encuesta
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!currentPoll && !showCreatePoll && (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-600 mb-4">
                    Crea encuestas rápidas para obtener feedback inmediato de tus estudiantes
                  </p>
                  <button
                    onClick={() => setShowCreatePoll(true)}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Crear Primera Encuesta
                  </button>
                </div>
              )}

              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">💡 Consejos:</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Las encuestas son anónimas y en tiempo real</li>
                  <li>• Puedes crear hasta 6 opciones por pregunta</li>
                  <li>• Los resultados se actualizan automáticamente</li>
                  <li>• Útil para evaluar comprensión o preferencias</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractivePanel;