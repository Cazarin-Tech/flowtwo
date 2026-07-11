"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Company {
  id: string;
  name: string;
  businessType: string;
  plan: string;
  status: string;
}

export default function CompaniesPage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);

  async function loadCompanies() {
    const response = await fetch("http://localhost:3333/companies", {
      cache: "no-store",
    });

    const data = await response.json();

    setCompanies(data);
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  async function deactivateCompany(id: string) {
    if (!confirm("Deseja desativar esta empresa?")) return;

    const response = await fetch(
      `http://localhost:3333/companies/${id}/deactivate`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      alert("Erro ao desativar empresa.");
      return;
    }

    alert("Empresa desativada com sucesso!");

    await loadCompanies();
    router.refresh();
  }

  async function activateCompany(id: string) {
    const response = await fetch(
      `http://localhost:3333/companies/${id}/activate`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      alert("Erro ao reativar empresa.");
      return;
    }

    alert("Empresa reativada com sucesso!");

    await loadCompanies();
    router.refresh();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#f8fafc",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: "bold",
            }}
          >
            Empresas
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#94a3b8",
              fontSize: "16px",
            }}
          >
            Gerencie todas as empresas cadastradas no FlowTwo.
          </p>
        </div>

        <Link href="/companies/new">
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + Nova Empresa
          </button>
        </Link>
      </div>

      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #334155",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              backgroundColor: "#334155",
            }}
          >
            <tr>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Ramo</th>
              <th style={thStyle}>Plano</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => (
              <tr key={company.id} style={trStyle}>
                <td style={tdStyle}>{company.name}</td>
                <td style={tdStyle}>{company.businessType}</td>
                <td style={tdStyle}>{company.plan}</td>

                <td
                  style={{
                    ...tdStyle,
                    color:
                      company.status === "Ativa"
                        ? "#22c55e"
                        : "#facc15",
                    fontWeight: "bold",
                  }}
                >
                  {company.status}
                </td>

                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <Link href={`/companies/${company.id}`}>
                      <button
                        style={{
                          backgroundColor: "#2563eb",
                          color: "#fff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Editar
                      </button>
                    </Link>

                    {company.status === "Ativa" ? (
                      <button
                        onClick={() => deactivateCompany(company.id)}
                        style={{
                          backgroundColor: "#dc2626",
                          color: "#fff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Desativar
                      </button>
                    ) : (
                      <button
                        onClick={() => activateCompany(company.id)}
                        style={{
                          backgroundColor: "#16a34a",
                          color: "#fff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Reativar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const thStyle = {
  padding: "18px",
  textAlign: "left" as const,
  fontSize: "15px",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "18px",
  borderTop: "1px solid #334155",
  fontSize: "15px",
};

const trStyle = {
  backgroundColor: "#1e293b",
};