"use client";
import { useState, useMemo } from "react";
import { useToastCtx } from "../../components/layout/Layout";
import DataTable, { Column } from "../../components/common/DataTable";
import { useMenuAll, useMenuRegister, useMenuUpdate, useMenuDelete } from "../../lib/api/hooks/useMenus";
import type { Menu, MenuRegisterRequest, MenuUpdateRequest } from "@/types";

const ICON_OPTIONS = [
  { value: 'dashboard', label: '대시보드' },
  { value: 'groups', label: '그룹' },
  { value: 'devices', label: '단말기' },
  { value: 'policies', label: '정책' },
  { value: 'pauses', label: '탐지중단' },
  { value: 'detections', label: '탐지' },
  { value: 'users', label: '직원' },
  { value: 'licenses', label: '라이선스' },
  { value: 'notifications', label: '알림' },
  { value: 'account', label: '계정' },
  { value: 'components', label: '컴포넌트' },
];

interface MenuFormData {
  title: string;
  path: string;
  icon: string;
  sortingOrder: number;
}

const initialFormData: MenuFormData = {
  title: '',
  path: '',
  icon: '',
  sortingOrder: 1,
};

export default function MenuAdmin() {
  const toast = useToastCtx();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState<MenuFormData>(initialFormData);

  const { data, isLoading, refetch } = useMenuAll();
  const registerMutation = useMenuRegister();
  const updateMutation = useMenuUpdate();
  const deleteMutation = useMenuDelete();

  const menus = data?.data ?? [];

  const cols: Column<Menu & Record<string, unknown>>[] = useMemo(
    () => [
      {
        key: "id",
        label: "ID",
        render: (v) => (
          <span style={{ fontFamily: "monospace", color: "var(--t2)" }}>
            {v as number}
          </span>
        ),
      },
      {
        key: "title",
        label: "메뉴명",
        render: (v) => (
          <span style={{ fontWeight: 600, color: "var(--t1)" }}>
            {v as string}
          </span>
        ),
      },
      {
        key: "path",
        label: "경로",
        render: (v) => (
          <code style={{ 
            background: "var(--bg3)", 
            padding: "2px 6px", 
            borderRadius: 4,
            fontSize: 12 
          }}>
            {v as string}
          </code>
        ),
      },
      {
        key: "icon",
        label: "아이콘",
        render: (v) => (
          <span style={{ fontSize: 12, color: "var(--t2)" }}>
            {v ? (v as string) : '-'}
          </span>
        ),
      },
      {
        key: "sortingOrder",
        label: "정렬순서",
        render: (v) => `${v}`,
      },
    ],
    []
  );

  const handleOpenModal = (menu?: Menu) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        title: menu.title,
        path: menu.path,
        icon: menu.icon || '',
        sortingOrder: menu.sortingOrder,
      });
    } else {
      setEditingMenu(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.path) {
      toast("메뉴명과 경로는 필수입니다.", "error");
      return;
    }

    try {
      if (editingMenu) {
        const updateData: MenuUpdateRequest = {
          menuId: editingMenu.id,
          title: formData.title,
          path: formData.path,
          icon: formData.icon || undefined,
          sortingOrder: formData.sortingOrder,
        };
        await updateMutation.mutateAsync(updateData);
        toast("메뉴가 수정되었습니다.", "success");
      } else {
        const registerData: MenuRegisterRequest = {
          title: formData.title,
          path: formData.path,
          icon: formData.icon || undefined,
          sortingOrder: formData.sortingOrder,
        };
        await registerMutation.mutateAsync(registerData);
        toast("메뉴가 등록되었습니다.", "success");
      }
      handleCloseModal();
      refetch();
    } catch {
      toast("처리 중 오류가 발생했습니다.", "error");
    }
  };

  const handleDelete = async (menuId: number) => {
    if (!confirm("정말 이 메뉴를 삭제하시겠습니까?")) return;
    
    try {
      await deleteMutation.mutateAsync(menuId);
      toast("메뉴가 삭제되었습니다.", "success");
      refetch();
    } catch {
      toast("삭제 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">메뉴 관리</div>
          <div className="ph-sub">
            총 {data?.meta?.size ?? menus.length}개 메뉴 등록됨
          </div>
        </div>
        <div className="ph-actions">
          <button
            className="btn btn-p"
            onClick={() => handleOpenModal()}
          >
            + 메뉴 추가
          </button>
        </div>
      </div>

      <DataTable
        cols={cols}
        rows={menus as (Menu & Record<string, unknown>)[]}
        loading={isLoading}
        rowKey="id"
        onRowClick={(row) => handleOpenModal(row as Menu)}
        emptyMessage="등록된 메뉴가 없습니다"
        emptyIcon="📋"
        actions={(row) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-sm btn-outline"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(row as Menu);
              }}
            >
              수정
            </button>
            <button
              className="btn btn-sm"
              style={{ background: '#ef4444', color: 'white' }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete((row as Menu).id);
              }}
            >
              삭제
            </button>
          </div>
        )}
      />

      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: 'var(--bg1)',
              borderRadius: 12,
              padding: 24,
              minWidth: 400,
              maxWidth: 500,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>
              {editingMenu ? '메뉴 수정' : '새 메뉴 추가'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label 
                  htmlFor="menu-title"
                  style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}
                >
                  메뉴명 *
                </label>
                <input
                  id="menu-title"
                  className="inp"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 대시보드"
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label 
                  htmlFor="menu-path"
                  style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}
                >
                  경로 *
                </label>
                <input
                  id="menu-path"
                  className="inp"
                  type="text"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  placeholder="예: /meercatch/dashboard"
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label 
                  htmlFor="menu-icon"
                  style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}
                >
                  아이콘
                </label>
                <select
                  id="menu-icon"
                  className="inp"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="">아이콘 선택</option>
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label 
                  htmlFor="menu-order"
                  style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}
                >
                  정렬 순서
                </label>
                <input
                  id="menu-order"
                  className="inp"
                  type="number"
                  value={formData.sortingOrder}
                  onChange={(e) => setFormData({ ...formData, sortingOrder: Number.parseInt(e.target.value) || 1 })}
                  min={1}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCloseModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn-p"
                  disabled={registerMutation.isPending || updateMutation.isPending}
                >
                  {editingMenu ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
