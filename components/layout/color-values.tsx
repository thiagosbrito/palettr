
export default function ColorValues({colorMode, colorValues}: { colorMode: string, colorValues: any }) {
    return (
        <div className="flex-1 space-y-3 text-left">
            <div className="bg-primary px-3 py-1 rounded-md">
                <p className="text-primary-foreground"><strong>Color mode:</strong> {String(colorMode).toUpperCase()}</p>
            </div>
            <div className="px-3 py-1 border rounded-lg w-full">
                {colorMode === 'hsl' && !!colorValues && (
                    <div>
                        <strong>H:</strong> {colorValues.h} <br/>
                        <strong>S:</strong> {colorValues.s} <br/>
                        <strong>L:</strong> {colorValues.l} <br/>
                        <strong>A:</strong> {colorValues.a}
                    </div>
                )}
                {colorMode === 'rgb' && !!colorValues && (
                    <div>
                        <strong>R:</strong> {colorValues.r} <br/>
                        <strong>G:</strong> {colorValues.g} <br/>
                        <strong>B:</strong> {colorValues.b} <br/>
                        <strong>A:</strong> {colorValues.a}
                    </div>
                )}
                {colorMode === 'hex' && !!colorValues && (
                    <div>
                        <strong>HEX:</strong> {colorValues}
                    </div>
                )}
            </div>
        </div>
    )
}