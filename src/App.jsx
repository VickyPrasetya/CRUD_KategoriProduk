import { useEffect, useState, useMemo } from "react";
import {
  Container, Row, Col, Card,
  Form, Button, Table,
  Toast, ToastContainer
} from "react-bootstrap";

export default function App() {
  const initialProducts = useMemo(() => ([]), []);

  const [products, setProducts] = useState(initialProducts);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [Harga, setHarga] = useState("");
  const [kategori, setKategori] = useState("");
  const [tanggalRilis, setTanggalRilis] = useState("");
  const [stok, setStok] = useState(0);
  const [aktif, setAktif] = useState(false);

  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Nama wajib diisi";
    else if (name.trim().length < 3) newErrors.name = "Minimal 3 karakter";

    if (!description.trim()) newErrors.description = "Deskripsi wajib diisi";
    else if (description.length < 20) newErrors.description = "Min 20 karakter";

    if (!Harga) newErrors.Harga = "Harga wajib diisi";
    else if (Harga <= 0) newErrors.Harga = "Harga harus > 0";

    if (!kategori) newErrors.kategori = "Kategori wajib dipilih";

    if (!tanggalRilis) newErrors.tanggalRilis = "Tanggal rilis wajib diisi";

    if (stok < 0) newErrors.stok = "Stok tidak boleh negatif";

    return newErrors;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setHarga("");
    setKategori("");
    setTanggalRilis("");
    setStok(0);
    setAktif(false);
    setErrors({});
    setEditingId(null);
  };

  const showToastMsg = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) {
      showToastMsg("Input tidak valid", "danger");
      return;
    }

    if (editingId === null) {
      const newProduct = {
        id: Date.now(),
        name,
        description,
        Harga: Number(Harga),
        kategori,
        tanggalRilis,
        stok: Number(stok),
        aktif,
      };
      setProducts([newProduct, ...products]);
      resetForm();
      showToastMsg("Produk ditambahkan");
    } else {
      setProducts(products.map(p =>
        p.id === editingId ? {
          ...p,
          name, description, Harga: Number(Harga),
          kategori, tanggalRilis, stok: Number(stok), aktif
        } : p
      ));
      resetForm();
      showToastMsg("Produk diperbarui");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setHarga(product.Harga);
    setKategori(product.kategori);
    setTanggalRilis(product.tanggalRilis);
    setStok(product.stok);
    setAktif(product.aktif);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Yakin hapus data?")) return;
    setProducts(products.filter(p => p.id !== id));
    showToastMsg("Produk dihapus");
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={5}>
          <Card>
            <Card.Header as="h5">
              {editingId ? "Edit Produk" : "Tambah Produk"}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                
                {/* NAMA */}
                <Form.Group className="mb-2">
                  <Form.Label>Nama Produk</Form.Label>
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                {/* DESKRIPSI */}
                <Form.Group className="mb-2">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>

                {/* HARGA */}
                <Form.Group className="mb-2">
                  <Form.Label>Harga</Form.Label>
                  <Form.Control
                    type="number"
                    value={Harga}
                    onChange={(e) => setHarga(e.target.value)}
                    isInvalid={!!errors.Harga}
                  />
                  <Form.Control.Feedback type="invalid">{errors.Harga}</Form.Control.Feedback>
                </Form.Group>

                {/* KATEGORI */}
                <Form.Group className="mb-2">
                  <Form.Label>Kategori</Form.Label>
                  <Form.Select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    isInvalid={!!errors.kategori}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    <option>Makanan</option>
                    <option>Minuman</option>
                    <option>Elektronik</option>
                    <option>Pakaian</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.kategori}</Form.Control.Feedback>
                </Form.Group>

                {/* TANGGAL */}
                <Form.Group className="mb-2">
                  <Form.Label>Tanggal Rilis</Form.Label>
                  <Form.Control
                    type="date"
                    value={tanggalRilis}
                    onChange={(e) => setTanggalRilis(e.target.value)}
                    isInvalid={!!errors.tanggalRilis}
                  />
                  <Form.Control.Feedback type="invalid">{errors.tanggalRilis}</Form.Control.Feedback>
                </Form.Group>

                {/* STOK */}
                <Form.Group className="mb-2">
                  <Form.Label>Stok</Form.Label>
                  <Form.Control
                    type="number"
                    value={stok}
                    onChange={(e) => setStok(e.target.value)}
                    isInvalid={!!errors.stok}
                  />
                  <Form.Control.Feedback type="invalid">{errors.stok}</Form.Control.Feedback>
                </Form.Group>

                {/* AKTIF */}
                <Form.Check
                  type="checkbox"
                  label="Produk Aktif"
                  checked={aktif}
                  onChange={(e) => setAktif(e.target.checked)}
                  className="mb-3"
                />

                <Button type="submit" className="w-100" variant={editingId ? "primary" : "success"}>
                  {editingId ? "Simpan Perubahan" : "Tambah Produk"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* TABLE */}
        <Col lg={7}>
          <Card>
            <Card.Header as="h5">Daftar Produk</Card.Header>
            <Card.Body className="p-0">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Aktif</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-4">Belum ada produk</td></tr>
                  ) : (
                    products.map((p, i) => (
                      <tr key={p.id}>
                        <td>{i + 1}</td>
                        <td>{p.name}</td>
                        <td>{p.kategori}</td>
                        <td>{p.Harga}</td>
                        <td>{p.stok}</td>
                        <td>{p.aktif ? "Ya" : "Tidak"}</td>
                        <td>
                          <Button size="sm" variant="warning" onClick={() => handleEdit(p)}>Edit</Button>{" "}
                          <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Hapus</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
          <Toast.Header><strong>Notifikasi</strong></Toast.Header>
          <Toast.Body className={toastVariant === "danger" ? "text-white" : ""}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}