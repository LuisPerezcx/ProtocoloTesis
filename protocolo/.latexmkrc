# .latexmkrc — receta común para Mac (BasicTeX) y Windows (MiKTeX)
# Motor por defecto: pdflatex. Biber se detecta y ejecuta automáticamente
# porque el preámbulo usa biblatex con backend=biber (latexmk moderno
# reconoce esto por el archivo .bcf, no hace falta forzarlo).

$pdf_mode = 1;                 # generar PDF vía pdflatex
$pdflatex = 'pdflatex -interaction=nonstopmode -synctex=1 -file-line-error %O %S';

# Salida de compilación separada del código fuente
$out_dir = 'build';
$aux_dir = 'build';

# Limpieza: además de los típicos, borra también los artefactos de biber
$clean_ext = 'bbl bcf run.xml synctex.gz';

# En xelatex (por si algún día se necesita, ej. fuentes especiales):
# $pdf_mode = 5; $xelatex = 'xelatex -interaction=nonstopmode -synctex=1 -file-line-error %O %S';
