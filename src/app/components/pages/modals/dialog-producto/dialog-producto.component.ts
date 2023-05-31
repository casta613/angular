import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from '../../../../interfaces/categoria';
import { Producto } from '../../../../interfaces/producto';
import { CategoriaService } from '../../../../services/categoria.service';
import { ProductoService } from '../../../../services/producto.service';

@Component({
  selector: 'app-dialog-producto',
  templateUrl: './dialog-producto.component.html',
  styleUrls: ['./dialog-producto.component.css']
})
export class DialogProductoComponent implements OnInit {
  formProducto: FormGroup;
  accion: string = "Agregar"
  accionBoton: string = "Guardar";
  listaCategorias: Categoria[] = [];
  imagen: string | null = null;
  imagenCargada: string | null = null;

  onFileSelected(event: any) {

    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      
      reader.readAsDataURL(file);
      

      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.imagen = base64String;
        this.imagenCargada = reader.result as string;

        };
    }
  }
 

  constructor(
    private dialogoReferencia: MatDialogRef<DialogProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public productoEditar: Producto,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _categoriaServicio: CategoriaService,
    private _productoServicio: ProductoService
  ) {
    this.formProducto = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      imagen: null,

    })


    if (this.productoEditar) {

      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }

    this._categoriaServicio.getCategorias().subscribe({
      next: (data) => {

        if (data.status) {

          this.listaCategorias = data.value;

          if (this.productoEditar)
            this.formProducto.patchValue({
              idCategoria: this.productoEditar.idCategoria
            })

        }
      },
      error: (e) => {
      },
      complete: () => {
      }
    })

  }


  ngOnInit(): void {

    if (this.productoEditar) {
      console.log(this.productoEditar)
      this.formProducto.patchValue({
        nombre: this.productoEditar.nombre,
        idCategoria: String(this.productoEditar.idCategoria),
        stock: this.productoEditar.stock,
        precio: this.productoEditar.precio,
      })
    }
  }

  agregarEditarProducto() {
    const formData = new FormData(); // Crea un nuevo objeto FormData

    formData.append('idProducto', this.productoEditar == null ? '0' : this.productoEditar.idProducto.toString());
    formData.append('nombre', this.formProducto.value.nombre);
    formData.append('idCategoria', this.formProducto.value.idCategoria.toString());
    formData.append('descripcionCategoria', '');
    formData.append('stock', this.formProducto.value.stock.toString());
    formData.append('precio', this.formProducto.value.precio);
    if (this.imagen) {
      formData.append('imagen', this.imagen);
    }

    if (this.productoEditar) {

      this._productoServicio.editdos(formData).subscribe({
        next: (data) => {

          if (data.status) {
            this.mostrarAlerta("El producto fue editado", "Exito");
            this.dialogoReferencia.close('editado')
          } else {
            this.mostrarAlerta("No se pudo editar el producto", "Error");
          }

        },
        error: (e) => {
          console.log(e)
        },
        complete: () => {
        }
      })


    } else {

      this._productoServicio.savedos(formData).subscribe({
        next: (data) => {

          if (data.status) {
            this.mostrarAlerta("El producto fue registrado", "Exito");
            this.dialogoReferencia.close('agregado')
          } else {
            this.mostrarAlerta("No se pudo registrar el producto", "Error");
          }

        },
        error: (e) => {
        },
        complete: () => {
        }
      })


    }
  }
 

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

}
