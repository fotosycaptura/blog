##############################################################
# Desarrollado por @fotosycaptura                            #
# Informar bugs o sugerencias                                #
# Requiere Python 3.x para su funcionamiento                 #
##############################################################

##############################################################
#Configuracion                                               #
# Tamaño de la imagen                                        #
# Extension de la imagen                                     #
##############################################################

smg_size = 800
smg_ext = "*.jpg"

##############################################################

import filecmp, shutil, os, PIL, fnmatch
from os import scandir, getcwd
from os.path import abspath
from os.path import join, getsize
from os.path import isfile
from PIL import Image

smg_version = "0.0.1"

def presentacion():
    print("******************************************************")
    print("                 XCX Resize                           ")
    print("                Version: " + smg_version + "          ")
    print("******************************************************")

"""
Define un ls para obtener un listado de archivos
"""
def ls(ruta = getcwd()):
    return [abspath(arch.path) for arch in scandir(ruta) if arch.is_file()]

def redimensiona():
    archivos = ls(getcwd())
    for i in archivos:
        #Se especifica el tipo de archivo, en este caso un JPG
        if fnmatch.fnmatch(i.upper(), smg_ext):
            basewidth = smg_size
            img = Image.open(i)
            wpercent = (basewidth / float(img.size[0]))
            hsize = int((float(img.size[1]) * float(wpercent)))
            img = img.resize((basewidth, hsize), PIL.Image.LANCZOS)
            img.save(i)
def menu():
    print ("Selecciona una opción")
    print ("\t 1 - Redimensionar imágenes a " + str(smg_size) + " px")
    print ("\t 2 - Salir")
    
def run():
    presentacion()
    while True:
        menu()
        opcionMenu = input("inserta un numero valor >> ")
        if opcionMenu == "1":
            print("Procesando")
            redimensiona()
            print("... Terminado")
            break
        elif opcionMenu == "2":
            break
    print("Finalizado. Presione [ENTER] para salir")
    input("> ")
    
if __name__ == '__main__':
    run()
