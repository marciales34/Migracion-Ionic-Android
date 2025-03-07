import { Injectable } from '@angular/core';
import {Camera, CameraPhoto, CameraResultType,CameraSource,Photo} from '@capacitor/camera'
import {Filesystem, Directory} from '@capacitor/filesystem'
import {Preferences} from '@capacitor/preferences'
import { Foto} from '../models/foto.interface'

@Injectable({
  providedIn: 'root'
})
export class FotoService {
  //ALMACENAR FOTOS
  public fotos: Foto[] = [];
  private PHOTO_STORAGE: string = "fotos"

  constructor() { }

  public async AñadirImagenGaleria()
  {
    //proceso para tomar la foto
    const CapturaFoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })
/*
    this.fotos.unshift({
      filepath: "foto_",
      webviewPath: CapturaFoto.webPath
    })*/

      const savedImageFile = await this.GuardarImagen(CapturaFoto)
      this.fotos.unshift(savedImageFile)
      Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.fotos)
      })
  }

  public async GuardarImagen(cameraPhoto: CameraPhoto)
  {
      //Convierte la foto en formato base64 
      const base64Data = await this.readAsBase64(cameraPhoto)
      //Escribir la foto en el directorio 
      const filename = new Date().getTime + '.jpeg';
      const savedFile = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Data
      })

      return { 
        filepath: filename,
        webviewPath: cameraPhoto.webPath
      }
  }

  public async readAsBase64(cameraPhoto: CameraPhoto)
  {
    //convertir de blob a Base64
    const response = await fetch(cameraPhoto.webPath!)
    const blob = await response.blob()

    return await this.convertBlobToBase64(blob) as string
  }

  convertBlobToBase64 = (blob : Blob) => new Promise((resolve, reject) =>{
    const reader = new FileReader
    reader.onerror = reject
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  })

  public async loadSaved()
  {
    //Se recuperan las foto del cache 

    const listaFotos = await Preferences.get({key: this.PHOTO_STORAGE})
    this.fotos = JSON.parse(listaFotos.value || '[]')

    //Desplegar las fotos leidas en formato base64 

    for (let foto of this.fotos)
    {
      //leer cada foto almacenada en el sistema de archivos

      const readFile = await Filesystem.readFile({
        path: foto.filepath,
        directory: Directory.Data
      })

      //Solo para plataforma web: Cargar las fotos en base64 
      foto.webviewPath = `data:image/jepg;base64,${readFile.data}`
    }
  }

}
